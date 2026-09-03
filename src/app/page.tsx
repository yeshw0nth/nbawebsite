"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FrameworkSelectionPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState("2025-26");

  const handleEnterWorkspace = () => {
    router.push(`/framework/nba/${selectedYear}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-center mb-10">
          Select Accreditation Framework
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NBA Card (Active) */}
          <div className="border border-border bg-surface p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-medium text-foreground tracking-tight">NBA</h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                National Board of Accreditation framework with active metrics and evidence lockers.
              </p>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="academic-year" className="text-xs font-medium text-muted uppercase tracking-wider">
                  Academic Year
                </label>
                <select 
                  id="academic-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface-alt text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer appearance-none"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
              </div>
              
              <button
                onClick={handleEnterWorkspace}
                className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Enter Workspace
              </button>
            </div>
          </div>

          {/* NAAC Card (Coming Soon) */}
          <div className="border border-border bg-surface p-6 rounded-xl opacity-60 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-medium text-foreground tracking-tight">NAAC</h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-surface-alt text-muted px-2 py-0.5 rounded border border-border">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                National Assessment and Accreditation Council evaluation grid and metric templates.
              </p>
            </div>
            <div className="mt-8">
              <button disabled className="w-full bg-surface-alt text-muted font-medium py-2 px-4 rounded-md text-sm cursor-not-allowed border border-border">
                Not Available
              </button>
            </div>
          </div>

          {/* AICTE Card (Coming Soon) */}
          <div className="border border-border bg-surface p-6 rounded-xl opacity-60 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-medium text-foreground tracking-tight">AICTE</h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-surface-alt text-muted px-2 py-0.5 rounded border border-border">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                All India Council for Technical Education approval process and compliance checklists.
              </p>
            </div>
            <div className="mt-8">
              <button disabled className="w-full bg-surface-alt text-muted font-medium py-2 px-4 rounded-md text-sm cursor-not-allowed border border-border">
                Not Available
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
