"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Search, CheckCircle2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import guidelinesData from "@/data/guidelines.json";
import { useProgress } from "@/context/ProgressContext";

type SubSubCriterion = {
  Title: string;
  Marks: number;
  Guidelines_and_Exhibits: {
    Evaluation_Guidelines: string;
    Exhibits_Context_to_be_Observed_Assessed: string;
  };
  id: string;
};

type SubCriterion = {
  Title: string;
  Marks: number;
  "Sub-Sub-Criteria"?: SubSubCriterion[];
  id: string;
};

type Criterion = {
  Criterion: string;
  Marks: number;
  "Sub-Criteria": SubCriterion[];
  id: string;
};

const guidelines = guidelinesData as Criterion[];

function matchesSearch(text: string, query: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const currentId = params?.id as string | undefined;
  
  const { isSubSubCompleted, totalSubSubs, completedSubSubs } = useProgress();
  const progressPercent = totalSubSubs > 0 ? Math.round((completedSubSubs / totalSubSubs) * 100) : 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Hydration fix state
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Layout states
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= 260 && newWidth <= 600) {
          setSidebarWidth(newWidth);
        } else if (newWidth < 260) {
          setSidebarWidth(260);
        } else if (newWidth > 600) {
          setSidebarWidth(600);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);
  
  // Prevent text selection while resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
  }, [isResizing]);

  // On mount or when currentId changes, ensure parent is expanded
  useEffect(() => {
    if (currentId) {
      const parts = currentId.split('-');
      const toExpand: Record<string, boolean> = {};
      if (parts.length >= 1) toExpand[parts[0]] = true;
      if (parts.length >= 2) toExpand[`${parts[0]}-${parts[1]}`] = true;
      
      setExpanded((prev) => ({ ...prev, ...toExpand }));
    }
  }, [currentId]);

  // Compute filtered tree and auto-expand logic
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) {
      return guidelines;
    }

    const query = searchQuery.trim();
    const result: Criterion[] = [];
    const newExpanded: Record<string, boolean> = {};

    guidelines.forEach((c, cIdx) => {
      const cId = `c${cIdx + 1}`;
      let cMatches = matchesSearch(c.Criterion, query);

      const filteredSubs: SubCriterion[] = [];
      c["Sub-Criteria"].forEach((s, sIdx) => {
        const sId = `${cId}-s${sIdx + 1}`;
        let sMatches = matchesSearch(s.Title, query);

        const filteredSubSubs: SubSubCriterion[] = [];
        s["Sub-Sub-Criteria"]?.forEach((ss, ssIdx) => {
          const ssMatches = 
            matchesSearch(ss.Title, query) || 
            matchesSearch(ss.Guidelines_and_Exhibits.Evaluation_Guidelines, query);
          
          if (ssMatches) {
            filteredSubSubs.push(ss);
            sMatches = true; // Parent should be kept
          }
        });

        if (sMatches) {
          filteredSubs.push({ ...s, "Sub-Sub-Criteria": filteredSubSubs.length > 0 ? filteredSubSubs : s["Sub-Sub-Criteria"] });
          cMatches = true; // Grandparent should be kept
          newExpanded[sId] = true; // Auto-expand matching Sub-Criterion
        }
      });

      if (cMatches) {
        result.push({ ...c, "Sub-Criteria": filteredSubs.length > 0 ? filteredSubs : c["Sub-Criteria"] });
        newExpanded[cId] = true; // Auto-expand matching Criterion
      }
    });

    // Update expanded state for search results
    setExpanded((prev) => ({ ...prev, ...newExpanded }));

    return result;
  }, [searchQuery]);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNodeClick = (id: string) => {
    router.push(`/criteria/${id}`);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? sidebarWidth : 0 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="relative flex-shrink-0 border-r border-zinc-200 bg-white h-full z-40"
    >
      {/* Toggle Button - Enlarged circular pill on border */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-[18px] z-[60] w-9 h-9 flex items-center justify-center rounded-full border border-zinc-300 bg-white shadow-sm text-zinc-400 hover:text-indigo-600 transition-colors"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
      </button>

      {/* Resize Handle - Active only when sidebar is open */}
      {isOpen && (
        <div 
          className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-indigo-400/50 transition-colors z-40"
          onMouseDown={startResizing}
        />
      )}

      {/* Clipping Wrapper - hides the content smoothly when width shrinks */}
      <div className="overflow-hidden h-full w-full">
        {/* Squish Prevention Wrapper - strictly locks dimensions */}
        <div style={{ width: sidebarWidth }} className="h-full overflow-y-auto flex flex-col">
          <div className="p-5 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-medium tracking-tight text-[#171717]">Guidelines</h1>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{isMounted ? progressPercent : 0}%</span>
            </div>
            
            {/* Minimal Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${isMounted ? progressPercent : 0}%` }} 
              />
            </div>
            
            {/* Minimal Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search guidelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-[#171717] placeholder-gray-400"
              />
            </div>
          </div>

          <div className="p-3 flex-1">
            {filteredTree.map((c, cIdx) => {
              const cId = c.id;
              const isExpanded = expanded[cId];
              const isActive = currentId === cId;
              
              return (
                <div key={cId} className="mb-2">
                  <button
                    onClick={(e) => {
                      toggleExpand(cId, e);
                      handleNodeClick(cId);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive ? "bg-indigo-50 text-indigo-600 font-medium" : "text-[#171717] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <span className="shrink-0 text-gray-400">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <span className="truncate text-left flex-1" title={c.Criterion}>
                      {c.Criterion}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1 pb-2 pl-7 space-y-1">
                          {c["Sub-Criteria"].map((s, sIdx) => {
                            const sId = s.id;
                            const isSExpanded = expanded[sId];
                            const isSActive = currentId === sId;

                            return (
                              <div key={sId}>
                                <button
                                  onClick={(e) => {
                                    toggleExpand(sId, e);
                                    handleNodeClick(sId);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                    isSActive
                                      ? "bg-indigo-50 text-indigo-600 font-medium"
                                      : "text-gray-600 hover:bg-[#F3F4F6] hover:text-[#171717]"
                                  }`}
                                >
                                  <span className="shrink-0 text-gray-400">
                                    {isSExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </span>
                                  <span className="truncate text-left flex-1" title={s.Title}>
                                    {s.Title}
                                  </span>
                                </button>

                                <AnimatePresence initial={false}>
                                  {isSExpanded && s["Sub-Sub-Criteria"] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pt-1 pb-1 pl-7 space-y-1">
                                        {s["Sub-Sub-Criteria"].map((ss, ssIdx) => {
                                          const ssId = ss.id;
                                          const isSsActive = currentId === ssId;

                                          return (
                                            <button
                                              key={ssId}
                                              onClick={() => handleNodeClick(ssId)}
                                              className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                                                isSsActive
                                                  ? "bg-indigo-50 text-indigo-600 font-medium"
                                                  : "text-gray-500 hover:bg-[#F3F4F6] hover:text-[#171717]"
                                              }`}
                                            >
                                              <span className="line-clamp-2 pr-2" title={ss.Title}>
                                                {ss.Title}
                                              </span>
                                              {isSubSubCompleted(ssId) && (
                                                <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                                              )}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Settings & Export */}
          <div className="p-4 border-t border-zinc-100 shrink-0 bg-zinc-50/50 space-y-2">
            <Link 
              href="/settings"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              System Settings
            </Link>
            <button
              onClick={() => window.open("/export", "_blank")}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Export SAR Audit
            </button>
            <form action={async () => {
              const { logoutAction } = await import('@/app/actions/auth');
              await logoutAction();
            }}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-2 border border-zinc-200 text-zinc-600 hover:text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
