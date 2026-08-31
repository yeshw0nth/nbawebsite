"use client";

import { useProgress } from "@/context/ProgressContext";
import { FileText, Link as LinkIcon, StickyNote, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

type Status = "Not Started" | "In Progress" | "Completed";

export default function ResourceInteractive({ 
  globalGuidelineId 
}: { 
  globalGuidelineId: string;
}) {
  const { statuses, notes, updateStatus, updateNote } = useProgress();
  
  const currentStatus = statuses[globalGuidelineId] || "Not Started";
  const currentNote = notes[globalGuidelineId] || "";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusChange = (status: Status) => {
    updateStatus(globalGuidelineId, status);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Status Toggle (Right below the title or somewhere visible) */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-8">
        <span className="text-sm font-medium text-gray-500 tracking-tight">Status:</span>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStatus === "Completed" ? "bg-indigo-50 text-indigo-600" :
              currentStatus === "In Progress" ? "bg-amber-50 text-amber-600" :
              "bg-gray-100 text-gray-600"
            }`}
          >
            {currentStatus}
            <ChevronDown size={14} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
              <button onClick={() => handleStatusChange("Not Started")} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Not Started</button>
              <button onClick={() => handleStatusChange("In Progress")} className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">In Progress</button>
              <button onClick={() => handleStatusChange("Completed")} className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50">Completed</button>
            </div>
          )}
        </div>
      </div>

      {/* Attached PDFs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight text-[#171717] flex items-center gap-2">
            <FileText size={18} className="text-gray-400" />
            Attached PDFs
          </h3>
          <button className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
            <Plus size={16} /> Upload File
          </button>
        </div>
        <div className="border border-gray-200 border-dashed rounded-lg p-5 bg-gray-50 flex flex-col items-center justify-center text-center h-40">
          <FileText size={32} className="text-gray-300 mb-3" />
          <p className="text-sm font-medium text-[#171717]">No PDFs attached</p>
          <p className="text-xs text-gray-500 mt-1">Upload relevant documentation for this guideline.</p>
        </div>
      </section>

      {/* Reference Links */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight text-[#171717] flex items-center gap-2">
            <LinkIcon size={18} className="text-gray-400" />
            Reference Links
          </h3>
          <button className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
            <Plus size={16} /> Add Link
          </button>
        </div>
        <div className="border border-gray-200 border-dashed rounded-lg p-5 bg-gray-50 flex flex-col items-center justify-center text-center h-40">
          <LinkIcon size={32} className="text-gray-300 mb-3" />
          <p className="text-sm font-medium text-[#171717]">No links added</p>
          <p className="text-xs text-gray-500 mt-1">Add URLs to external resources or evidence.</p>
        </div>
      </section>

      {/* User Notes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight text-[#171717] flex items-center gap-2">
            <StickyNote size={18} className="text-gray-400" />
            User Notes
          </h3>
        </div>
        <textarea 
          value={currentNote}
          onChange={(e) => updateNote(globalGuidelineId, e.target.value)}
          placeholder="Write down your observations or internal comments..."
          className="w-full border border-gray-200 rounded-lg p-5 bg-white text-gray-600 text-sm leading-relaxed focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all min-h-[160px] resize-y"
        />
      </section>
    </div>
  );
}
