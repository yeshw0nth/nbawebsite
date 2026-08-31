"use client";

import { useState } from "react";
import TreeVisualizer from "./components/TreeVisualizer";
import { LayoutGrid, Network } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"split" | "tree">("tree");

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 leading-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 mt-1">Explore the SAR framework visually or via the sidebar.</p>
        </div>
        
        <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200 shadow-sm">
          <button
            onClick={() => setView("split")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === "split" ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <LayoutGrid size={16} />
            Split View
          </button>
          <button
            onClick={() => setView("tree")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === "tree" ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
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
        <div className="border border-zinc-200 border-dashed rounded-xl p-12 text-center bg-zinc-50/50">
          <h2 className="text-lg font-medium text-zinc-900 mb-2">Select an item from the sidebar</h2>
          <p className="text-zinc-500 text-sm">Navigate through the criteria using the sidebar to view details in Split View.</p>
        </div>
      )}
    </div>
  );
}
