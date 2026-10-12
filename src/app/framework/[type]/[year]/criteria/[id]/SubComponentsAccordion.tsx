"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProgressBar from "@/app/components/ProgressBar";

type SubSubCriterion = {
  Title: string;
  Marks?: number;
};

type SubCriterion = {
  Title: string;
  Marks?: number;
  "Sub-Sub-Criteria"?: SubSubCriterion[];
};

export default function SubComponentsAccordion({
  items,
  parentId,
}: {
  items: SubCriterion[];
  parentId: string; // e.g., 'c1'
}) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const params = useParams();
  const type = (params?.type as string) || "nba";
  const year = (params?.year as string) || "2025-26";
  const basePath = `/framework/${type}/${year}`;

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="border border-border rounded-xl divide-y divide-border bg-card shadow-sm overflow-hidden">
      {items.map((sub, idx) => {
        const isExpanded = !!expanded[idx];
        const hasChildren = sub["Sub-Sub-Criteria"] && sub["Sub-Sub-Criteria"].length > 0;
        const subId = `${parentId}-s${idx + 1}`;

        return (
          <div key={idx} className="flex flex-col">
            {/* Header / Trigger */}
            <div
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-muted/40 ${
                isExpanded ? "bg-muted/30" : "bg-card"
              }`}
              onClick={() => toggleExpand(idx)}
            >
              <div className="flex items-center gap-3 min-w-0 pr-4">
                {hasChildren && (
                  <span className="text-muted-foreground shrink-0">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                )}
                <p className="font-medium text-sm text-foreground leading-snug">
                  {sub.Title}
                </p>
              </div>

              {/* Synchronized Real-Time Progress Bar */}
              <ProgressBar nodeId={subId} barWidthClass="w-20 sm:w-28" />
            </div>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
              {hasChildren && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="overflow-hidden bg-card"
                >
                  <div className="border-t border-border divide-y divide-border/60 pl-6 sm:pl-8 bg-muted/10">
                    {sub["Sub-Sub-Criteria"]!.map((ss, ssIdx) => {
                      const ssId = `${subId}-ss${ssIdx + 1}`;
                      return (
                        <Link
                          key={ssIdx}
                          href={`${basePath}/criteria/${ssId}`}
                          className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/40 group"
                        >
                          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors pr-4 leading-snug">
                            {ss.Title}
                          </p>

                          {/* Sub-Sub-Criterion Progress Bar */}
                          <ProgressBar nodeId={ssId} barWidthClass="w-16 sm:w-24" />
                        </Link>
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
  );
}
