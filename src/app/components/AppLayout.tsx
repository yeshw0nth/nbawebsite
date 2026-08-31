"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Sidebar from "./Sidebar";
import { ProgressProvider } from "@/context/ProgressContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ProgressProvider>
      <div className="flex h-full w-full bg-white text-[#171717] font-sans overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: isOpen ? 320 : 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="shrink-0 h-full relative z-30 border-r border-gray-200 bg-white"
          style={{ overflow: 'hidden' }}
        >
          <div className="w-[320px] h-full">
            <Suspense fallback={<div className="w-[320px] h-full" />}>
              <Sidebar />
            </Suspense>
          </div>
        </motion.div>

        <main className="flex-1 min-w-0 bg-white h-full overflow-y-auto relative z-10">
          <div className="sticky top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-transparent h-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-6 left-6 p-1.5 text-gray-400 hover:text-[#171717] transition-colors rounded-md hover:bg-gray-100 bg-white shadow-sm border border-gray-200"
              title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>
          
          {/* Main Content Pane */}
          <div className="max-w-4xl px-20 py-20 mt-4">
            {children}
          </div>
        </main>
      </div>
    </ProgressProvider>
  );
}
