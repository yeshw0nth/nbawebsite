"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";

type SubSubCriterion = {
  Title: string;
  Marks: number;
};

type SubCriterion = {
  Title: string;
  Marks: number;
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

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
      {items.map((sub, idx) => {
        const isExpanded = !!expanded[idx];
        const hasChildren = sub["Sub-Sub-Criteria"] && sub["Sub-Sub-Criteria"].length > 0;
        const subId = `${parentId}-s${idx + 1}`;

        return (
          <div key={idx} className="flex flex-col">
            {/* Header / Trigger */}
            <div
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-[#F3F4F6] ${
                isExpanded ? "bg-[#F3F4F6]" : "bg-white"
              }`}
              onClick={() => toggleExpand(idx)}
            >
              <div className="flex items-center gap-3">
                {hasChildren && (
                  <span className="text-gray-400">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                )}
                <p className="font-medium text-sm text-[#171717]">{sub.Title}</p>
              </div>
              <span className="text-sm text-gray-500 font-medium whitespace-nowrap ml-4">
                {sub.Marks} Marks
              </span>
            </div>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
              {hasChildren && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="overflow-hidden bg-white"
                >
                  <div className="border-t border-gray-100 divide-y divide-gray-50 ml-8">
                    {sub["Sub-Sub-Criteria"]!.map((ss, ssIdx) => {
                      const ssId = `${subId}-ss${ssIdx + 1}`;
                      return (
                        <Link
                          key={ssIdx}
                          href={`/criteria/${ssId}`}
                          className="flex items-center justify-between p-3 transition-colors hover:bg-indigo-50 group"
                        >
                          <p className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
                            {ss.Title}
                          </p>
                          <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors whitespace-nowrap ml-4">
                            {ss.Marks} Marks
                          </span>
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
