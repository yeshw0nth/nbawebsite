"use client";

import { useState } from "react";

export function Table9Widget() {
  const [data, setData] = useState({
    budget: 0,
    actual: 0,
    students: 0,
  });

  const spentPercent = data.budget > 0 ? ((data.actual / data.budget) * 100).toFixed(2) : 0;
  const perStudent = data.students > 0 ? (data.actual / data.students).toFixed(2) : 0;

  const updateField = (field: keyof typeof data, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground">Table No. 9.8.1: Program Specific Budget Allocation, Utilization</h3>
        <p className="text-sm text-muted mt-1">% Spent = (Actual / Budget) * 100 | Expenditure per student = Actual / Students</p>
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
                <td className="p-0 border-r border-border">
                  <input 
                    type="number" min="0" value={data.budget || ""} 
                    onChange={e => updateField("budget", e.target.value)}
                    className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                  />
                </td>
                <td className="p-0 border-r border-border">
                  <input 
                    type="number" min="0" value={data.actual || ""} 
                    onChange={e => updateField("actual", e.target.value)}
                    className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                  />
                </td>
                <td className="px-4 py-3 border-r border-border bg-muted/10 cursor-not-allowed text-accent font-medium">
                  {spentPercent}%
                </td>
                <td className="p-0 border-r border-border">
                  <input 
                    type="number" min="0" value={data.students || ""} 
                    onChange={e => updateField("students", e.target.value)}
                    className="w-full h-full px-4 py-3 bg-transparent focus:outline-none focus:bg-surface-alt/50" 
                  />
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
