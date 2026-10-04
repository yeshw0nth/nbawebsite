"use client";

import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import guidelinesData from "@/data/guidelines.json";
import Link from "next/link";
import React from "react";

type SubSubCriterion = {
  Title: string;
  Marks: number;
  Guidelines_and_Exhibits?: {
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

export default function BreadcrumbNav() {
  const params = useParams();
  
  if (!params) return null;

  const type = (params.type as string) || "nba";
  const year = (params.year as string) || "2025-26";
  const id = (params.criterionId as string) || (params.id as string);
  const guidelineId = params.guidelineId as string;

  if (!id) return null;

  const parts = id.split('-');
  const breadcrumbs: { title: string; href?: string }[] = [];
  
  let currentHref = `/framework/${type}/${year}/criteria`;

  if (parts.length >= 1) {
    const cIdx = parseInt(parts[0].replace('c', '')) - 1;
    const criterion = guidelines[cIdx];
    if (criterion) {
      currentHref += `/${parts[0]}`;
      breadcrumbs.push({ title: criterion.Criterion, href: currentHref });

      if (parts.length >= 2) {
        const sIdx = parseInt(parts[1].replace('s', '')) - 1;
        const sub = criterion["Sub-Criteria"]?.[sIdx];
        if (sub) {
          currentHref += `-${parts[1]}`;
          if (sub.Title !== criterion.Criterion) {
            breadcrumbs.push({ title: sub.Title, href: currentHref });
          }

          if (parts.length === 3) {
            const ssIdx = parseInt(parts[2].replace('ss', '')) - 1;
            const subSub = sub["Sub-Sub-Criteria"]?.[ssIdx];
            if (subSub) {
              currentHref += `-${parts[2]}`;
              if (subSub.Title !== sub.Title && subSub.Title !== criterion.Criterion) {
                breadcrumbs.push({ title: subSub.Title, href: currentHref });
              }

              // Extract lettered guideline if on deep route
              if (guidelineId && guidelineId !== 'overview' && subSub.Guidelines_and_Exhibits?.Evaluation_Guidelines) {
                const lines = subSub.Guidelines_and_Exhibits.Evaluation_Guidelines.split('\n');
                const guidelineText = lines.find((line, idx) => {
                  const lineMatch = line.match(/^([A-Z])\./);
                  const gId = lineMatch ? lineMatch[1] : (idx + 1).toString();
                  return gId === guidelineId;
                });
                
                if (guidelineText) {
                  // e.g. "> A. Adherence to the Academic Calendar (02)"
                  breadcrumbs.push({ title: guidelineText.trim() });
                }
              }
            }
          }
        }
      }
    }
  }

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap text-sm text-muted-foreground tracking-tight mb-4 pb-2">
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const isMiddle = !isLast && idx > 0;
        
        return (
          <React.Fragment key={idx}>
            {crumb.href && !isLast ? (
              <Link 
                href={crumb.href}
                className={`hover:text-foreground transition-colors ${isMiddle ? 'inline-block align-bottom truncate max-w-[200px]' : ''}`}
                title={crumb.title}
              >
                {crumb.title}
              </Link>
            ) : (
              <span 
                className={`text-foreground font-medium ${!isLast && isMiddle ? 'inline-block align-bottom truncate max-w-[200px]' : ''}`}
                title={crumb.title}
              >
                {crumb.title}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight size={14} className="mx-1 text-border flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
