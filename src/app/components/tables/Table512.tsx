"use client";

import { useState } from "react";

export function Table512() {
  const [data, setData] = useState({
    CAY: { s: 0, f: 0, ff: 0 },
    CAYm1: { s: 0, f: 0, ff: 0 },
    CAYm2: { s: 0, f: 0, ff: 0 },
  });

  const calculateSFR = (row: { s: number; f: number; ff: number }) => {
    const tf = row.f - row.ff;
    if (tf <= 0 || isNaN(tf)) return 0;
    return Number((row.s / tf).toFixed(2));
  };

  const sfrCAY = calculateSFR(data.CAY);
  const sfrCAYm1 = calculateSFR(data.CAYm1);
  const sfrCAYm2 = calculateSFR(data.CAYm2);
  const avgSFR = Number(((sfrCAY + sfrCAYm1 + sfrCAYm2) / 3).toFixed(2));

  const updateField = (year: keyof typeof data, field: "s" | "f" | "ff", value: string) => {
    setData(prev => ({
      ...prev,
      [year]: { ...prev[year], [field]: Number(value) || 0 }
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground">Table No. 5.1.2: Student-faculty ratio</h3>
        <p className="text-sm text-muted mt-1">SFR = S / (F - FF)</p>
      </div>

      <div className="border border-border rounded-md bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-surface-alt/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border w-1/3">Item</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">CAY</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border">CAYm1</th>
                <th className="px-4 py-3 font-medium text-muted tracking-tight">CAYm2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Row: S */}
              <tr className="hover:bg-surface-alt/30 transition-colors">
                <td className="px-4 py-3 border-r border-border font-medium">S = Total no. of students</td>
                {(["CAY", "CAYm1", "CAYm2"] as const).map(year => (
                  <td key={year} className="p-0 border-r border-border last:border-r-0">
                    <input 
                      type="number" min="0" value={data[year].s || ""} 
                      onChange={e => updateField(year, "s", e.target.value)}
                      className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                    />
                  </td>
                ))}
              </tr>
              {/* Row: F */}
              <tr className="hover:bg-surface-alt/30 transition-colors">
                <td className="px-4 py-3 border-r border-border font-medium">F = Total no. of faculty</td>
                {(["CAY", "CAYm1", "CAYm2"] as const).map(year => (
                  <td key={year} className="p-0 border-r border-border last:border-r-0">
                    <input 
                      type="number" min="0" value={data[year].f || ""} 
                      onChange={e => updateField(year, "f", e.target.value)}
                      className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                    />
                  </td>
                ))}
              </tr>
              {/* Row: FF */}
              <tr className="hover:bg-surface-alt/30 transition-colors">
                <td className="px-4 py-3 border-r border-border font-medium">FF = Faculty with 100% 1st year load</td>
                {(["CAY", "CAYm1", "CAYm2"] as const).map(year => (
                  <td key={year} className="p-0 border-r border-border last:border-r-0">
                    <input 
                      type="number" min="0" value={data[year].ff || ""} 
                      onChange={e => updateField(year, "ff", e.target.value)}
                      className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                    />
                  </td>
                ))}
              </tr>
              {/* Row: TF */}
              <tr className="bg-surface-alt/10">
                <td className="px-4 py-3 border-r border-border font-medium text-muted">TF = Total faculty (F - FF)</td>
                {(["CAY", "CAYm1", "CAYm2"] as const).map(year => (
                  <td key={year} className="px-4 py-3 border-r border-border last:border-r-0 bg-muted/10 cursor-not-allowed text-muted-foreground">
                    {data[year].f - data[year].ff}
                  </td>
                ))}
              </tr>
              {/* Row: SFR */}
              <tr className="bg-surface-alt/30">
                <td className="px-4 py-3 border-r border-border font-semibold text-accent">Student Faculty Ratio (SFR = S/TF)</td>
                <td className="px-4 py-3 border-r border-border bg-muted/10 cursor-not-allowed font-semibold text-accent">{sfrCAY}</td>
                <td className="px-4 py-3 border-r border-border bg-muted/10 cursor-not-allowed font-semibold text-accent">{sfrCAYm1}</td>
                <td className="px-4 py-3 bg-muted/10 cursor-not-allowed font-semibold text-accent">{sfrCAYm2}</td>
              </tr>
              {/* Row: Average */}
              <tr className="bg-surface-alt/50">
                <td colSpan={3} className="px-4 py-3 border-r border-border font-semibold text-right text-foreground">Average SFR for 3 years</td>
                <td className="px-4 py-3 bg-muted/10 cursor-not-allowed font-bold text-accent">{avgSFR}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
