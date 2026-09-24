"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";

export function Table531({ guidelineId }: { guidelineId?: string }) {
  const tableId = "Table531";
  const { tableData, updateTableData } = useProgress();
  const contextData = (guidelineId && tableData[guidelineId]?.[tableId]) || {
    CAY: { rf1: 0, af1: 0, rf2: 0, af2: 0, rf3: 0, af3: 0 },
    CAYm1: { rf1: 0, af1: 0, rf2: 0, af2: 0, rf3: 0, af3: 0 },
    CAYm2: { rf1: 0, af1: 0, rf2: 0, af2: 0, rf3: 0, af3: 0 },
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

  const getAvg = (field: any) => {
    return Number(((data.CAY[field] + data.CAYm1[field] + data.CAYm2[field]) / 3).toFixed(2));
  };

  const avgRF1 = getAvg("rf1");
  const avgAF1 = getAvg("af1");
  const avgRF2 = getAvg("rf2");
  const avgAF2 = getAvg("af2");
  const avgRF3 = getAvg("rf3");
  const avgAF3 = getAvg("af3");

  let marks = 0;
  if (avgRF1 > 0 && avgRF2 > 0 && avgRF3 > 0) {
    const term1 = Math.min(avgAF1 / avgRF1, 1);
    const term2 = Math.min((avgAF2 * 0.6) / avgRF2, 1);
    const term3 = Math.min((avgAF3 * 0.4) / avgRF3, 1);
    marks = (term1 + term2 + term3) * 12.5;
    // Cap at 25 marks as per PDF
    marks = Math.min(Number(marks.toFixed(2)), 25);
  }

  const updateField = (year: keyof typeof data, field: keyof typeof data.CAY, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [year]: { ...prev[year], [field]: Number(value) || 0 }
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-foreground">Table No. 5.3.1: Faculty cadre proportion details</h3>
          <p className="text-sm text-muted mt-1">Marks = [(AF1/RF1) + (AF2*0.6/RF2) + (AF3*0.4/RF3)] * 12.5</p>
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
                <th rowSpan={2} className="px-4 py-3 font-medium text-muted tracking-tight border-r border-b border-border">Year</th>
                <th colSpan={2} className="px-4 py-2 font-medium text-muted tracking-tight border-r border-b border-border text-center">Professors</th>
                <th colSpan={2} className="px-4 py-2 font-medium text-muted tracking-tight border-r border-b border-border text-center">Associate Professors</th>
                <th colSpan={2} className="px-4 py-2 font-medium text-muted tracking-tight border-b border-border text-center">Assistant Professors</th>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-muted tracking-tight border-r border-border text-xs">Required (RF1)</th>
                <th className="px-4 py-2 font-medium text-muted tracking-tight border-r border-border text-xs">Available (AF1)</th>
                <th className="px-4 py-2 font-medium text-muted tracking-tight border-r border-border text-xs">Required (RF2)</th>
                <th className="px-4 py-2 font-medium text-muted tracking-tight border-r border-border text-xs">Available (AF2)</th>
                <th className="px-4 py-2 font-medium text-muted tracking-tight border-r border-border text-xs">Required (RF3)</th>
                <th className="px-4 py-2 font-medium text-muted tracking-tight text-xs">Available (AF3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(["CAY", "CAYm1", "CAYm2"] as const).map(year => (
                <tr key={year} className="hover:bg-surface-alt/30 transition-colors">
                  <td className="px-4 py-3 border-r border-border font-medium">{year}</td>
                  {(["rf1", "af1", "rf2", "af2", "rf3", "af3"] as const).map(field => (
                    <td key={field} className="border-r border-border last:border-r-0 p-0 text-center">
                      {isEditing ? (
                        <input 
                          type="number" min="0" value={data[year][field] || ""} 
                          onChange={e => updateField(year, field, e.target.value)}
                          className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50 text-center text-foreground" 
                        />
                      ) : (
                        <div className="w-full h-full px-4 py-3 text-foreground">{data[year][field] || "-"}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-surface-alt/30 font-medium">
                <td className="px-4 py-3 border-r border-border">Average Numbers</td>
                <td className="px-4 py-3 border-r border-border text-center bg-muted/10 cursor-not-allowed text-muted-foreground">{avgRF1}</td>
                <td className="px-4 py-3 border-r border-border text-center bg-muted/10 cursor-not-allowed text-muted-foreground">{avgAF1}</td>
                <td className="px-4 py-3 border-r border-border text-center bg-muted/10 cursor-not-allowed text-muted-foreground">{avgRF2}</td>
                <td className="px-4 py-3 border-r border-border text-center bg-muted/10 cursor-not-allowed text-muted-foreground">{avgAF2}</td>
                <td className="px-4 py-3 border-r border-border text-center bg-muted/10 cursor-not-allowed text-muted-foreground">{avgRF3}</td>
                <td className="px-4 py-3 text-center bg-muted/10 cursor-not-allowed text-muted-foreground">{avgAF3}</td>
              </tr>
              <tr className="bg-surface-alt/50">
                <td colSpan={6} className="px-4 py-3 border-r border-border font-semibold text-right text-foreground">Faculty Cadre Proportion Marks</td>
                <td className="px-4 py-3 bg-muted/10 cursor-not-allowed font-bold text-accent text-center">{marks}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
