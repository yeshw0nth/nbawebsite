"use client";

import React from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import BreadcrumbNav from "@/app/components/BreadcrumbNav";
import { resolveTableKey, getIQACTableConfig } from "@/lib/iqacTableConfigs";

const SpreadsheetGrid = dynamic(() => import("@/app/components/SpreadsheetGrid"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
      Loading evaluation grid...
    </div>
  ),
});

const IQACSwocEditor = dynamic(() => import("@/app/components/iqac/IQACSwocEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
      Loading SWOC editor...
    </div>
  ),
});

export default function IQACDataPage() {
  const params = useParams();
  const year = (params?.year as string) || "2025-26";
  const quarter = (params?.quarter as string) || "Q1";
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];

  // Determine active section from URL slug
  let section = "part-a";
  let tableId = "t1";

  if (slug.length >= 1) {
    const firstSegment = slug[0].toLowerCase();
    if (firstSegment === "swoc") {
      section = "swoc";
    } else if (firstSegment === "part-b") {
      section = "part-b";
    } else if (firstSegment === "part-c") {
      section = "part-c";
    } else if (firstSegment === "part-a") {
      section = "part-a";
      tableId = slug[1]?.toLowerCase() || "t1";
    } else if (firstSegment.startsWith("t")) {
      section = "part-a";
      tableId = firstSegment;
    }
  }

  // Resolve config for Part A
  const resolvedKey = resolveTableKey(tableId);
  const tableConfig = getIQACTableConfig(resolvedKey);

  return (
    <article className="animate-in fade-in duration-300 pb-16 space-y-6">
      {/* Dynamic Breadcrumbs */}
      <BreadcrumbNav />

      {/* 1. Part A: Specific Data Table */}
      {section === "part-a" && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
              Part A: Department Assessment
            </span>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mt-2.5">
              {tableConfig?.title || `Table: ${tableId.toUpperCase()}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Internal Quality Assurance Cell (IQAC) • Cycle {quarter} ({year}) • Department of Mechanical Engineering
            </p>
          </div>

          <SpreadsheetGrid
            guidelineId={`iqac-part-a-${tableId}`}
            tableKey={resolvedKey}
          />
        </div>
      )}

      {/* 2. SWOC Analysis */}
      {section === "swoc" && (
        <IQACSwocEditor nodeId={`iqac-swoc-${quarter}`} />
      )}

      {/* 3. Part B: AAA Department Rubrics */}
      {section === "part-b" && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
              Part B: AAA Department Rubrics
            </span>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mt-2.5">
              Assessment of the Department by AAA Committee
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Rating Scale: <strong>5 - Excellent</strong> | <strong>4 - Very Good</strong> | <strong>3 - Good</strong> | <strong>2 - Average*</strong> (needs improvisation) | <strong>0 - Incomplete</strong>.
              Pre-populated with all 48 Key Aspects mandated by the GPREC IQAC Manual.
            </p>
          </div>

          <SpreadsheetGrid
            guidelineId={`iqac-part-b-${quarter}`}
            tableKey="part_b_department_assessment"
          />

          {/* Committee Signatures Panel */}
          <div className="mt-10 pt-6 border-t border-border">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              AAA Audit Peer Committee Sign-off
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                "Member-1",
                "Member-2",
                "Member-3",
                "Member-4",
                "Member-Secretary",
                "Chairperson",
              ].map((member) => (
                <div key={member} className="p-3 bg-surface border border-border rounded-xl text-center">
                  <span className="block text-xs font-semibold text-foreground">{member}</span>
                  <span className="block text-[11px] text-muted-foreground mt-1">Pending Signature</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Part C: AAA Institution Rubrics */}
      {section === "part-c" && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
              Part C: AAA Institution Rubrics
            </span>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mt-2.5">
              Institution Specific Assessment by AAA Committee
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Rating Scale: <strong>5 - Excellent</strong> | <strong>4 - Very Good</strong> | <strong>3 - Good</strong> | <strong>2 - Average*</strong> | <strong>0 - Incomplete</strong>.
              Evaluates college-level administration across all 34 Institutional Key Aspects.
            </p>
          </div>

          <SpreadsheetGrid
            guidelineId={`iqac-part-c-${quarter}`}
            tableKey="part_c_institution_assessment"
          />

          {/* Committee Signatures Panel */}
          <div className="mt-10 pt-6 border-t border-border">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              AAA Committee Executive Endorsement
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                "Member-1",
                "Member-2",
                "Member-3",
                "Member-4",
                "Member-Secretary",
                "Chairperson",
              ].map((member) => (
                <div key={member} className="p-3 bg-surface border border-border rounded-xl text-center">
                  <span className="block text-xs font-semibold text-foreground">{member}</span>
                  <span className="block text-[11px] text-muted-foreground mt-1">Pending Signature</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
