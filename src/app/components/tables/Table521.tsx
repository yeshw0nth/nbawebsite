"use client";

import { useState } from "react";

export function Table521() {
  const [data, setData] = useState({
    CAY: { x: 0, y: 0, rf: 0 },
    CAYm1: { x: 0, y: 0, rf: 0 },
    CAYm2: { x: 0, y: 0, rf: 0 },
  });

  const calculateFQI = (row: { x: number; y: number; rf: number }) => {
    if (row.rf === 0 || isNaN(row.rf)) return 0;
    const fqi = 2.5 * ((10 * row.x + 4 * row.y) / row.rf);
    return Number(fqi.toFixed(2));
  };

  const fqiCAY = calculateFQI(data.CAY);
  const fqiCAYm1 = calculateFQI(data.CAYm1);
  const fqiCAYm2 = calculateFQI(data.CAYm2);
  const avgAssessment = Number(((fqiCAY + fqiCAYm1 + fqiCAYm2) / 3).toFixed(2));

  const updateField = (year: keyof typeof data, field: "x" | "y" | "rf", value: string) => {
    setData(prev => ({
      ...prev,
      [year]: { ...prev[year], [field]: Number(value) || 0 }
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground">Table No.5.2.1: Faculty qualification</h3>
        <p className="text-sm text-muted mt-1">FQI = 2.5 * [(10X + 4Y) / RF]</p>
      </div>

      <div className="border border-border rounded-md bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-surface-alt/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">Year</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">X (Ph.D)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">Y (M.Tech)</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">RF</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight">FQI=2.5*[(10X+4Y)/RF]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(["CAY", "CAYm1", "CAYm2"] as const).map(year => {
                const fqi = calculateFQI(data[year]);
                return (
                  <tr key={year} className="hover:bg-surface-alt/30 transition-colors">
                    <td className="px-4 py-3 font-medium border-r border-border">{year}</td>
                    <td className="p-0 border-r border-border">
                      <input 
                        type="number" min="0" value={data[year].x || ""} 
                        onChange={e => updateField(year, "x", e.target.value)}
                        className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                      />
                    </td>
                    <td className="p-0 border-r border-border">
                      <input 
                        type="number" min="0" value={data[year].y || ""} 
                        onChange={e => updateField(year, "y", e.target.value)}
                        className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                      />
                    </td>
                    <td className="p-0 border-r border-border">
                      <input 
                        type="number" min="0" value={data[year].rf || ""} 
                        onChange={e => updateField(year, "rf", e.target.value)}
                        className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                      />
                    </td>
                    <td className="px-4 py-3 bg-muted/10 cursor-not-allowed text-muted-foreground font-medium">
                      {fqi}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-surface-alt/30 font-medium">
                <td colSpan={4} className="px-4 py-3 border-r border-border text-right">Average Assessment</td>
                <td className="px-4 py-3 bg-muted/10 cursor-not-allowed text-accent font-semibold">
                  {avgAssessment}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
