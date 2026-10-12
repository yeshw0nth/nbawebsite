"use client";

import { Suspense, useState } from "react";
import Sidebar from "./Sidebar";
import { ProgressProvider } from "@/context/ProgressContext";
import { ScoreProvider } from "@/context/ScoreContext";
import CommandPalette from "./CommandPalette";
import Link from "next/link";
import { Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const params = useParams();
  const pathname = usePathname();
  
  const isIqac = (params?.type as string)?.toLowerCase() === "iqac" || pathname?.includes("/iqac/");
  const type = (params?.type as string) || (isIqac ? "IQAC" : "NBA");
  const pathSegments = pathname ? pathname.split("/").filter(Boolean) : [];
  const year = (params?.year as string) || (isIqac && pathSegments[2] ? pathSegments[2] : "2025-26");
  const quarter = (params?.quarter as string) || (isIqac && pathSegments[3] ? pathSegments[3] : "");

  return (
    <ScoreProvider>
      <ProgressProvider>
        <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-sans">
          <CommandPalette />
          <Suspense fallback={<div className="w-[320px] h-full border-r border-border bg-surface" />}>
            <Sidebar isOpen={isSidebarOpen} />
          </Suspense>

          {/* Main Content Pane */}
          <main className="flex-1 min-w-0 bg-background h-screen flex flex-col">
            <header className="h-14 flex items-center px-6 border-b border-border bg-background shrink-0 gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-muted hover:text-foreground transition-colors p-1"
                title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
              
              <Link 
                href="/" 
                className="text-muted hover:text-accent transition-colors flex items-center justify-center p-2 rounded-md hover:bg-surface-alt"
                title="Back to Framework Selection"
              >
                <Home size={18} />
              </Link>
              
              <div className="h-4 w-px bg-border mx-1" />

              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-tight text-foreground truncate">
                  GPREC ME Dept Accreditation System
                </h1>
                <span className="text-muted hidden sm:inline-block">/</span>
                <span className="text-sm font-semibold tracking-tight text-accent bg-accent-subtle px-2 py-0.5 rounded-md border border-border uppercase">
                  {type} / {year} {quarter ? `/ ${quarter}` : ""}
                </span>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl px-20 py-10 mt-4 mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </ProgressProvider>
    </ScoreProvider>
  );
}
