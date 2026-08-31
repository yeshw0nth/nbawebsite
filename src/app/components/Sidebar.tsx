"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Search, CheckCircle2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import guidelinesData from "@/data/guidelines.json";
import { useProgress } from "@/context/ProgressContext";

type SubSubCriterion = {
  Title: string;
  Marks: number;
  Guidelines_and_Exhibits: {
    Evaluation_Guidelines: string;
    Exhibits_Context_to_be_Observed_Assessed: string;
  };
};

type SubCriterion = {
  Title: string;
  Marks: number;
  "Sub-Sub-Criteria"?: SubSubCriterion[];
};

type Criterion = {
  Criterion: string;
  Marks: number;
  "Sub-Criteria": SubCriterion[];
};

const guidelines = guidelinesData as Criterion[];

// Helper to flatten and search
function matchesSearch(text: string, query: string) {
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
    <aside className="fixed inset-y-0 left-0 w-[320px] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-medium tracking-tight text-[#171717]">Guidelines</h1>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{progressPercent}%</span>
        </div>
        
        {/* Minimal Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }} 
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
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredTree.map((criterion, cIdx) => {
          const cId = `c${cIdx + 1}`;
          const isExpanded = !!expanded[cId];
          const isActive = currentId === cId;

          return (
            <div key={cId} className="flex flex-col">
              <div 
                className={`flex items-center justify-between w-full px-3 py-2.5 text-left rounded-md transition-colors font-medium text-sm group cursor-pointer ${
                  isActive ? "bg-indigo-50 text-indigo-600" : "hover:bg-[#F3F4F6] text-[#171717]"
                }`}
                onClick={() => handleNodeClick(cId)}
              >
                <span className="truncate pr-2" title={criterion.Criterion}>
                  {criterion.Criterion}
                </span>
                <button 
                  onClick={(e) => toggleExpand(cId, e)}
                  className={`shrink-0 p-1 rounded-sm transition-colors ${isActive ? "text-indigo-600 hover:bg-indigo-100" : "text-gray-400 hover:bg-gray-200 group-hover:text-gray-600"}`}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 pb-2 pl-3 space-y-1 border-l border-gray-100 ml-4">
                      {criterion["Sub-Criteria"].map((sub, sIdx) => {
                        const sId = `${cId}-s${sIdx + 1}`;
                        const isSubExpanded = !!expanded[sId];
                        const isSubActive = currentId === sId;
                        const hasSubSubs = sub["Sub-Sub-Criteria"] && sub["Sub-Sub-Criteria"].length > 0;

                        return (
                          <div key={sId} className="flex flex-col">
                            <div 
                              className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                                isSubActive
                                  ? "bg-indigo-50 text-indigo-600 font-medium"
                                  : "text-gray-600 hover:bg-[#F3F4F6] hover:text-[#171717]"
                              }`}
                              onClick={() => handleNodeClick(sId)}
                            >
                              <span className="line-clamp-2 pr-2" title={sub.Title}>
                                {sub.Title}
                              </span>
                              {hasSubSubs && (
                                <button 
                                  onClick={(e) => toggleExpand(sId, e)}
                                  className={`shrink-0 p-1 rounded-sm transition-colors ${isSubActive ? "text-indigo-600 hover:bg-indigo-100" : "text-gray-400 hover:bg-gray-200"}`}
                                >
                                  {isSubExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                              )}
                            </div>

                            <AnimatePresence initial={false}>
                              {hasSubSubs && isSubExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-1 pb-1 pl-3 space-y-1 border-l border-gray-100 ml-4">
                                    {sub["Sub-Sub-Criteria"]!.map((ss, ssIdx) => {
                                      const ssId = `${sId}-ss${ssIdx + 1}`;
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
      </nav>
    </aside>
  );
}
