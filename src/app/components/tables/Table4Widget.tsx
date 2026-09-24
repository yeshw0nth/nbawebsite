"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";

export function Table4Widget({ guidelineId }: { guidelineId?: string }) {
  const tableId = "Table4Widget";
  const { tableData, updateTableData } = useProgress();
  const contextData = (guidelineId && tableData[guidelineId]?.[tableId]) || {
    LYG: { n1: 0, n2: 0, n3: 0, n4: 0, n5: 0, n6: 0, b: 0 },
    LYGm1: { n1: 0, n2: 0, n3: 0, n4: 0, n5: 0, n6: 0, b: 0 },
    LYGm2: { n1: 0, n2: 0, n3: 0, n4: 0, n5: 0, n6: 0, b: 0 },
  };
  const [data, setData] = useState(contextData);

  useEffect(() => {
    if (guidelineId) {
      updateTableData(guidelineId, tableId, data);
    }
  }, [data, guidelineId]);

  useEffect(() => {
    if (guidelineId && tableData[guidelineId]?.[tableId]) {
      setData(tableData[guidelineId][tableId]);
    }
  }, [tableData, guidelineId]);

  const calculateSR = (row: any) => {
    // A* = N1 + N2 + N5 - N6
    const a = row.n1 + row.n2 + row.n5 - row.n6;
    if (a <= 0 || isNaN(a)) return { a: 0, sr: 0 };
    const sr = (row.b / a) * 100;
    return { a, sr: Number(sr.toFixed(2)) };
  };

  const sr1 = calculateSR(data.LYG);
  const sr2 = calculateSR(data.LYGm1);
  const sr3 = calculateSR(data.LYGm2);

  const avgSR = Number(((sr1.sr + sr2.sr + sr3.sr) / 3).toFixed(2));

  const updateField = (year: keyof typeof data, field: keyof typeof data.LYG, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [year]: { ...prev[year], [field]: Number(value) || 0 }
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground">Tables 4A-4C: Admissions & Success Rate</h3>
        <p className="text-sm text-muted mt-1">A = N1 + N2 + N5 - N6. Success Rate (SR) = (B / A) * 100</p>
      </div>

      <div className="border border-border rounded-md bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-surface-alt/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">Year</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">N1 (1st Yr)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">N2 (Lateral)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">N3 (Div)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">N4 (Super)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">N5 (Entry)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">N6 (Exit)</th>
                <th className="px-4 py-3 font-medium text-accent tracking-tight border-r border-border">A* (Computed)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">B (Graduated)</th>
                <th className="px-4 py-3 font-medium text-accent tracking-tight">SR = (B/A)*100</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(["LYG", "LYGm1", "LYGm2"] as const).map((year, i) => {
                const result = [sr1, sr2, sr3][i];
                return (
                  <tr key={year} className="hover:bg-surface-alt/30 transition-colors">
                    <td className="px-4 py-3 border-r border-border font-medium">{year}</td>
                    {(["n1", "n2", "n3", "n4", "n5", "n6"] as const).map(field => (
                      <td key={field} className="p-0 border-r border-border">
                        <input 
                          type="number" min="0" value={data[year][field] || ""} 
                          onChange={e => updateField(year, field, e.target.value)}
                          className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 border-r border-border bg-muted/10 cursor-not-allowed text-muted-foreground font-medium">
                      {result.a}
                    </td>
                    <td className="p-0 border-r border-border">
                      <input 
                        type="number" min="0" value={data[year].b || ""} 
                        onChange={e => updateField(year, "b", e.target.value)}
                        className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                      />
                    </td>
                    <td className="px-4 py-3 bg-muted/10 cursor-not-allowed text-accent font-semibold">
                      {result.sr}%
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-surface-alt/50">
                <td colSpan={9} className="px-4 py-3 border-r border-border font-semibold text-right text-foreground">Average Success Rate (SR) for 3 years</td>
                <td className="px-4 py-3 bg-muted/10 cursor-not-allowed font-bold text-accent">{avgSR}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
