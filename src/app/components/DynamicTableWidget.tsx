"use client";

import { useState, useRef } from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Download, Upload, X } from "lucide-react";
import Papa from "papaparse";

interface DynamicTableWidgetProps {
  title: string;
  columns: ColumnDef<any, any>[];
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  csvTemplateHeaders?: string[];
  renderAddForm: (onSubmit: (data: any) => void, onCancel: () => void) => React.ReactNode;
}

export function DynamicTableWidget({
  title,
  columns,
  data,
  setData,
  csvTemplateHeaders,
  renderAddForm
}: DynamicTableWidgetProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    if (!csvTemplateHeaders) return;
    const csvContent = Papa.unparse([csvTemplateHeaders]);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}_Template.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // results.data is an array of objects
        // In a real app we'd map and validate the CSV headers to our data structure.
        // For demonstration, we simply append the raw rows.
        if (results.data && results.data.length > 0) {
          setData((prev) => [...prev, ...results.data]);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {csvTemplateHeaders && (
            <>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground bg-surface border border-border rounded-md transition-colors shadow-sm"
              >
                <Download size={14} />
                Template
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground bg-surface border border-border rounded-md transition-colors shadow-sm"
              >
                <Upload size={14} />
                Import CSV
              </button>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </>
          )}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add Record
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={data} />

      {/* Slide-out Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[400px] sm:w-[500px] h-full bg-surface border-l border-border shadow-2xl flex flex-col slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium tracking-tight text-foreground">Add New Record</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-muted hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {renderAddForm((newData) => {
                setData((prev) => [...prev, newData]);
                setIsDrawerOpen(false);
              }, () => setIsDrawerOpen(false))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
