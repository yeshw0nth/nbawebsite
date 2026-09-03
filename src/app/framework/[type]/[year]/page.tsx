"use client";

import { useState } from "react";
import TreeVisualizer from "@/app/components/TreeVisualizer";
import DashboardMetrics from "@/app/components/DashboardMetrics";
import { LayoutGrid, Network } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"split" | "tree">("split");

  return (
    <div className="animate-in fade-in duration-300">
      
      <DashboardMetrics />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">Dashboard Overview</h1>
          <p className="text-muted mt-1">Explore the SAR framework visually or via the sidebar.</p>
        </div>
        
        <div className="flex items-center bg-surface-alt p-1 rounded-lg border border-border shadow-sm">
          <button
            onClick={() => setView("split")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === "split" ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            <LayoutGrid size={16} />
            Split View
          </button>
          <button
            onClick={() => setView("tree")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === "tree" ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            <Network size={16} />
            Tree Map
          </button>
        </div>
      </div>

      {view === "tree" ? (
        <TreeVisualizer />
      ) : (
        <div className="border border-border border-dashed rounded-xl p-12 text-center bg-surface-alt">
          <h2 className="text-lg font-medium text-foreground mb-2">Select an item from the sidebar</h2>
          <p className="text-muted text-sm">Navigate through the criteria using the sidebar to view details in Split View.</p>
        </div>
      )}
    </div>
  );
}
