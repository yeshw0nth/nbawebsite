"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DynamicTableWidget } from "../DynamicTableWidget";

function createTableWidget(title: string, csvHeaders: string[]) {
  const columns: ColumnDef<any>[] = csvHeaders.map(h => ({
    accessorKey: h,
    header: h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }));

  return function Widget({ guidelineId }: { guidelineId?: string }) {
    return (
      <DynamicTableWidget
        title={title}
        columns={columns}
        guidelineId={guidelineId}
        csvTemplateHeaders={csvHeaders}
        renderAddForm={(onSubmit, onCancel) => (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newRecord: any = {};
              csvHeaders.forEach(k => {
                newRecord[k] = formData.get(k) as string;
              });
              onSubmit(newRecord);
            }}
            className="flex flex-col gap-4"
          >
            {csvHeaders.map(header => (
              <div key={header} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">{header}</label>
                <input 
                  name={header}
                  required
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface-alt text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t border-border mt-2">
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-surface-alt text-muted hover:text-foreground rounded-md transition-colors text-sm font-medium border border-border"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-accent text-white hover:bg-accent-hover rounded-md transition-colors text-sm font-medium"
              >
                Save Record
              </button>
            </div>
          </form>
        )}
      />
    );
  };
}

export const Table711 = createTableWidget("Table No. 7.1.1: Laboratories and Technical Manpower", ["laboratoryName", "batchSize", "majorEquipment", "weeklyUtilization", "staffName", "staffDesignation", "staffQualification"]);
export const Table751 = createTableWidget("Table No. 7.5.1: Project Laboratory / Centre of Excellence", ["laboratoryName"]);
