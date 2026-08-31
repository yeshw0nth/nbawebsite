"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useScore } from "@/context/ScoreContext";
import { useProgress } from "@/context/ProgressContext";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Vault state
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleClearCache = () => {
    if (confirm("Are you sure? This will wipe all local SAR evaluation data.")) {
      localStorage.removeItem("sar_scores");
      localStorage.removeItem("guideline_statuses");
      localStorage.removeItem("guideline_notes");
      setCleared(true);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleExportVault = () => {
    const scores = localStorage.getItem("sar_scores");
    const statuses = localStorage.getItem("guideline_statuses");
    const notes = localStorage.getItem("guideline_notes");
    
    const vaultData = {
      scores: scores ? JSON.parse(scores) : {},
      statuses: statuses ? JSON.parse(statuses) : {},
      notes: notes ? JSON.parse(notes) : {}
    };

    const blob = new Blob([JSON.stringify(vaultData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sar_vault_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">System Settings</h1>
        <p className="text-muted">Manage your application theme, access controls, and local vault data.</p>
      </div>

      <div className="space-y-8">
        
        {/* Appearance Tab */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Appearance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "light", name: "Light Mode", bg: "bg-white", text: "text-zinc-900" },
              { id: "pastel-dark", name: "Pastel Dark", bg: "bg-[#2A2734]", text: "text-[#E2DCE9]" },
              { id: "sepia", name: "Sepia", bg: "bg-[#F4ECD8]", text: "text-[#433422]" },
              { id: "soft-cream", name: "Soft Cream", bg: "bg-[#FCFBF7]", text: "text-[#4A4A4A]" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  theme === t.id ? "border-accent bg-accent-subtle" : "border-border hover:border-accent-hover"
                }`}
              >
                <div className={`w-full h-16 rounded-md mb-3 border border-border flex items-center justify-center ${t.bg} ${t.text}`}>
                  <span className="text-sm font-medium">Aa</span>
                </div>
                <span className="text-sm font-medium text-foreground">{t.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Access Management Tab */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Access Management</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Global Shared Password</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  className="flex-1 px-4 py-2 text-sm border border-border rounded-md bg-surface-alt text-muted focus:outline-none focus:border-accent"
                  disabled
                />
                <button className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-hover transition-colors">
                  Update
                </button>
              </div>
              <p className="text-xs text-muted mt-2">
                * Modifying the global environment password requires redeployment in a serverless environment.
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <h3 className="text-md font-medium text-foreground mb-2">Generate Session Link</h3>
              <p className="text-sm text-muted mb-4">Create a temporary read-only access link for institutional coordinators.</p>
              <button 
                onClick={() => alert("Mock: Session link copied to clipboard!")}
                className="bg-surface border border-border text-foreground hover:bg-surface-alt px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Copy Temp Link
              </button>
            </div>
          </div>
        </section>

        {/* Data & Vault Control Tab */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Data & Vault Control</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleExportVault}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm"
            >
              Export Vault Metadata (JSON)
            </button>
            <button 
              onClick={handleClearCache}
              disabled={cleared}
              className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-3 rounded-md text-sm font-medium transition-colors"
            >
              {cleared ? "Cache Cleared..." : "Clear Local Cache"}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
