"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";

export function Table9Widget({ guidelineId }: { guidelineId?: string }) {
  const tableId = "Table9Widget";
  const { tableData, updateTableData } = useProgress();
  const contextData = (guidelineId && tableData[guidelineId]?.[tableId]) || {
    budget: 0,
    actual: 0,
    students: 0,
  };
  const [data, setData] = useState(contextData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (guidelineId && tableData[guidelineId]?.[tableId]) {
      setData(tableData[guidelineId][tableId]);
    }
  }, [tableData, guidelineId]);

  const handleSave = async () => {
    if (!guidelineId) return;
    setIsSaving(true);
    await updateTableData(guidelineId, tableId, data);
    setIsSaving(false);
    setIsEditing(false);
  };

  const spentPercent = data.budget > 0 ? ((data.actual / data.budget) * 100).toFixed(2) : 0;
  const perStudent = data.students > 0 ? (data.actual / data.students).toFixed(2) : 0;

  const updateField = (field: keyof typeof data, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-foreground">Table No. 9.8.1: Program Specific Budget Allocation, Utilization</h3>
          <p className="text-sm text-muted mt-1">% Spent = (Actual / Budget) * 100 | Expenditure per student = Actual / Students</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors shadow-sm disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-accent bg-surface border border-border hover:bg-surface-alt rounded-md transition-colors shadow-sm"
            >
              Edit Table
            </button>
          )}
        </div>
      </div>

      <div className="border border-border rounded-md bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-surface-alt/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">Total Budget (CFY)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">Actual Expenditure (CFY)</th>
                <th className="px-4 py-3 font-medium text-accent tracking-tight border-r border-border">% Spent</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">Total No. of Students</th>
                <th className="px-4 py-3 font-medium text-accent tracking-tight">Expenditure per Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surface-alt/30 transition-colors">
                <td className="border-r border-border p-0">
                  {isEditing ? (
                    <input 
                      type="number" min="0" value={data.budget || ""} 
                      onChange={e => updateField("budget", e.target.value)}
                      className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50 text-foreground" 
                    />
                  ) : (
                    <div className="w-full h-full px-4 py-3 text-foreground">{data.budget || "-"}</div>
                  )}
                </td>
                <td className="border-r border-border p-0">
                  {isEditing ? (
                    <input 
                      type="number" min="0" value={data.actual || ""} 
                      onChange={e => updateField("actual", e.target.value)}
                      className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50 text-foreground" 
                    />
                  ) : (
                    <div className="w-full h-full px-4 py-3 text-foreground">{data.actual || "-"}</div>
                  )}
                </td>
                <td className="px-4 py-3 border-r border-border bg-muted/10 cursor-not-allowed text-accent font-medium">
                  {spentPercent}%
                </td>
                <td className="border-r border-border p-0">
                  {isEditing ? (
                    <input 
                      type="number" min="0" value={data.students || ""} 
                      onChange={e => updateField("students", e.target.value)}
                      className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50 text-foreground" 
                    />
                  ) : (
                    <div className="w-full h-full px-4 py-3 text-foreground">{data.students || "-"}</div>
                  )}
                </td>
                <td className="px-4 py-3 bg-muted/10 cursor-not-allowed text-accent font-medium">
                  ₹{perStudent}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
