"use client";

import { Suspense } from "react";
import Sidebar from "./Sidebar";
import { ProgressProvider } from "@/context/ProgressContext";
import { ScoreProvider } from "@/context/ScoreContext";
import CommandPalette from "./CommandPalette";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScoreProvider>
      <ProgressProvider>
        <div className="flex h-screen w-full bg-zinc-50 overflow-hidden text-zinc-900 font-sans">
          <CommandPalette />
          <Suspense fallback={<div className="w-[320px] h-full border-r border-zinc-200 bg-white" />}>
            <Sidebar />
          </Suspense>

          {/* Main Content Pane */}
          <main className="flex-1 min-w-0 bg-zinc-50 h-screen flex flex-col">
            <header className="h-14 flex items-center px-6 border-b border-zinc-200 bg-zinc-50 shrink-0">
              <Link 
                href="/" 
                className="text-zinc-500 hover:text-indigo-600 transition-colors flex items-center justify-center p-2 rounded-md hover:bg-zinc-100/50"
                title="Home / Dashboard"
              >
                <Home size={20} />
              </Link>
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
