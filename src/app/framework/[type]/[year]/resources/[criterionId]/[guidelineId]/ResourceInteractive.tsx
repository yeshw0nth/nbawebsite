"use client";

import { useProgress, Status } from "@/context/ProgressContext";
import { FileText, Link as LinkIcon, StickyNote, Plus, ChevronDown, UploadCloud, Trash2, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

import { Table5AWidget } from "@/app/components/tables/Criterion5Tables";
import { 
  Table6111, Table61211, Table61221, Table6131, Table6141, Table6151, Table6161, Table6171,
  Table6211, Table6221, Table6241, Table6251, Table6261 
} from "@/app/components/tables/Criterion6Tables";
import { Table1151, Table142, Table151 } from "@/app/components/tables/Criterion1Tables";
import { Table381, Table382, Table383 } from "@/app/components/tables/Criterion3Tables";
import { Table711, Table751 } from "@/app/components/tables/Criterion7Tables";
import { Table4Widget } from "@/app/components/tables/Table4Widget";
import { Table512 } from "@/app/components/tables/Table512";
import { Table521 } from "@/app/components/tables/Table521";
import { Table531 } from "@/app/components/tables/Table531";
import { Table9Widget } from "@/app/components/tables/Table9Widget";

type FileMeta = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

type TableProps = { guidelineId?: string };

const tableMap: Record<string, React.FC<TableProps> | React.FC<TableProps>[]> = {
  "c1-s1-ss5": Table1151,
  "c1-s4-ss2": Table142,
  "c1-s5-ss1": Table151,
  "c3-s8-ss1": [Table381, Table382, Table383],
  "c4-s2-ss1": Table4Widget,
  "c5-s1-ss1": [Table512, Table5AWidget],
  "c5-s2-ss1": Table521,
  "c5-s3-ss1": Table531,
  "c6-s1-ss1": Table6111,
  "c6-s1-ss2": [Table61211, Table61221],
  "c6-s1-ss3": Table6131,
  "c6-s1-ss4": Table6141,
  "c6-s1-ss5": Table6151,
  "c6-s1-ss6": Table6161,
  "c6-s1-ss7": Table6171,
  "c6-s2-ss1": Table6211,
  "c6-s2-ss2": Table6221,
  "c6-s2-ss4": Table6241,
  "c6-s2-ss5": Table6251,
  "c6-s2-ss6": Table6261,
  "c7-s1-ss1": Table711,
  "c7-s5-ss1": Table751,
  "c9-s8-ss1": Table9Widget,
};

export default function ResourceInteractive({ 
  globalGuidelineId 
}: { 
  globalGuidelineId: string;
}) {
  const { getNodeStatus, notes, updateStatus, updateNote, ensureNodeExists } = useProgress();
  const params = useParams();
  const frameworkType = (params?.type as string) || "NBA";
  const academicYear = (params?.year as string) || "2025-26";
  
  const currentStatus = getNodeStatus(globalGuidelineId);
  const currentNote = notes[globalGuidelineId] || "";

  const [files, setFiles] = useState<FileMeta[]>([]);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchFiles = async () => {
      const { data } = await supabase
        .from('node_resources')
        .select('id, title, url, resource_type, accreditation_nodes!inner(framework_type, academic_year, node_id)')
        .eq('accreditation_nodes.framework_type', frameworkType)
        .eq('accreditation_nodes.academic_year', academicYear)
        .eq('accreditation_nodes.node_id', globalGuidelineId);
        
      if (isMounted && data) {
        const mapped = data.map((r: any) => ({
          id: r.id,
          name: r.title,
          size: 0,
          type: r.resource_type,
          url: r.url
        }));
        setFiles(mapped);
      }
    };
    fetchFiles();
    return () => { isMounted = false; };
  }, [globalGuidelineId, frameworkType, academicYear]);

  const handleStatusChange = (status: Status) => {
    updateStatus(globalGuidelineId, status);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    const nodeUuid = await ensureNodeExists(globalGuidelineId);
    
    for (const f of acceptedFiles) {
      const filePath = `${frameworkType}/${academicYear}/${globalGuidelineId}/${Date.now()}_${f.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('accreditation_evidence')
        .upload(filePath, f);
        
      if (uploadError) {
        console.error("Upload failed", uploadError);
        continue;
      }
      
      const { data: publicUrlData } = supabase
        .storage
        .from('accreditation_evidence')
        .getPublicUrl(filePath);
        
      const { data: insertData, error: insertError } = await supabase
        .from('node_resources')
        .insert({
          node_uuid: nodeUuid,
          resource_type: 'pdf',
          title: f.name,
          url: publicUrlData.publicUrl
        } as any)
        .select()
        .single();
        
      if (insertData) {
        const rowData = insertData as any;
        setFiles(prev => [...prev, {
          id: rowData.id,
          name: rowData.title,
          size: f.size,
          type: rowData.resource_type,
          url: rowData.url
        }]);
      }
    }
    setIsUploading(false);
  }, [ensureNodeExists, globalGuidelineId, frameworkType, academicYear]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = async (id: string, url: string) => {
    // Optimistic UI
    setFiles(prev => prev.filter(f => f.id !== id));
    
    // DB delete
    await supabase.from('node_resources').delete().eq('id', id);
    
    // Bucket delete
    const urlParts = url.split('/accreditation_evidence/');
    if (urlParts.length === 2) {
      await supabase.storage.from('accreditation_evidence').remove([urlParts[1]]);
    }
  };

  const TableComponent = tableMap[globalGuidelineId];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Status Toggle - 3-way Segmented Control */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <span className="text-sm font-medium text-muted tracking-tight">Guideline Status</span>
        <div className="flex items-center p-1 bg-surface-alt border border-border rounded-lg shadow-sm">
          <button 
            onClick={() => handleStatusChange("pending")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              currentStatus === "pending" ? "bg-surface text-muted shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => handleStatusChange("ongoing")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              currentStatus === "ongoing" ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Ongoing
          </button>
          <button 
            onClick={() => handleStatusChange("completed")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              currentStatus === "completed" ? "bg-surface text-emerald-600 shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Dynamic Data Table Rendering */}
      {TableComponent && (
        <section className="mb-8">
          {Array.isArray(TableComponent) ? (
            TableComponent.map((T, i) => <T key={i} guidelineId={globalGuidelineId} />)
          ) : (
            <TableComponent guidelineId={globalGuidelineId} />
          )}
        </section>
      )}

      {/* Attached PDFs Locker */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <FileText size={18} className="text-zinc-400" />
            Evidence Locker
          </h3>
        </div>
        
        {files.length > 0 && (
          <ul className="mb-4 space-y-2">
            {files.map((file) => (
              <li key={file.id} className="flex items-center justify-between bg-white border border-zinc-200 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-md">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-900 line-clamp-1 hover:underline hover:text-indigo-600 transition-colors">
                      {file.name}
                    </a>
                    {file.size > 0 && <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>}
                  </div>
                </div>
                <button onClick={() => removeFile(file.id, file.url)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors" title="Delete File">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors ${
            isDragActive ? "border-indigo-400 bg-indigo-50/50" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
          } ${isUploading ? "cursor-wait opacity-70" : "cursor-pointer"}`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          {isUploading ? (
            <Loader2 size={32} className="mb-3 text-indigo-500 animate-spin" />
          ) : (
            <UploadCloud size={32} className={`mb-3 ${isDragActive ? 'text-indigo-500' : 'text-zinc-400'}`} />
          )}
          <p className="text-sm font-medium text-zinc-900">
            {isUploading ? "Uploading files..." : "Drag & drop files here, or click to select files"}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Supports PDF, DOCX, XLSX (Max 10MB)</p>
        </div>
      </section>

      {/* User Notes (Markdown) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight text-zinc-900 flex items-center gap-2">
            <StickyNote size={18} className="text-zinc-400" />
            Review Notes
          </h3>
          <button 
            onClick={() => setIsEditingNote(!isEditingNote)}
            className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
          >
            {isEditingNote ? "Preview Markdown" : "Edit Notes"}
          </button>
        </div>
        
        {isEditingNote ? (
          <textarea 
            value={currentNote}
            onChange={(e) => updateNote(globalGuidelineId, e.target.value)}
            placeholder="Write down your observations (Markdown supported)..."
            className="w-full border border-zinc-200 rounded-lg p-5 bg-white text-zinc-900 text-sm leading-relaxed focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all min-h-[200px] resize-y font-mono"
          />
        ) : (
          <div className="w-full border border-zinc-200 rounded-lg p-5 bg-white min-h-[200px] prose prose-sm prose-zinc max-w-none">
            {currentNote ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentNote}</ReactMarkdown>
            ) : (
              <p className="text-zinc-400 italic">No notes provided yet. Click "Edit Notes" to start writing.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
