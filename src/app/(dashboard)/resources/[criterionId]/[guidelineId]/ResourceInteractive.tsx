"use client";

import { useProgress } from "@/context/ProgressContext";
import { FileText, Link as LinkIcon, StickyNote, Plus, ChevronDown, UploadCloud, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Status = "Not Started" | "In Progress" | "Completed";

type FileMeta = {
  name: string;
  size: number;
  type: string;
};

export default function ResourceInteractive({ 
  globalGuidelineId 
}: { 
  globalGuidelineId: string;
}) {
  const { statuses, notes, updateStatus, updateNote } = useProgress();
  
  const currentStatus = statuses[globalGuidelineId] || "Not Started";
  const currentNote = notes[globalGuidelineId] || "";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [isEditingNote, setIsEditingNote] = useState(false);

  const handleStatusChange = (status: Status) => {
    updateStatus(globalGuidelineId, status);
    setIsDropdownOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Status Toggle */}
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-8">
        <span className="text-sm font-medium text-zinc-500 tracking-tight">Status:</span>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStatus === "Completed" ? "bg-indigo-50 text-indigo-600" :
              currentStatus === "In Progress" ? "bg-amber-50 text-amber-600" :
              "bg-zinc-100 text-zinc-600"
            }`}
          >
            {currentStatus}
            <ChevronDown size={14} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-zinc-200 rounded-md shadow-lg z-50 overflow-hidden">
              <button onClick={() => handleStatusChange("Not Started")} className="w-full text-left px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50">Not Started</button>
              <button onClick={() => handleStatusChange("In Progress")} className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">In Progress</button>
              <button onClick={() => handleStatusChange("Completed")} className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50">Completed</button>
            </div>
          )}
        </div>
      </div>

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
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between bg-white border border-zinc-200 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-md">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 line-clamp-1">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(idx)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragActive ? "border-indigo-400 bg-indigo-50/50" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud size={32} className={`mb-3 ${isDragActive ? 'text-indigo-500' : 'text-zinc-400'}`} />
          <p className="text-sm font-medium text-zinc-900">Drag & drop files here, or click to select files</p>
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
