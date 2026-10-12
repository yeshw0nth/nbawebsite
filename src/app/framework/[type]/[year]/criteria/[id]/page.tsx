import guidelinesData from "@/data/guidelines.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SubComponentsAccordion from "./SubComponentsAccordion";
import BreadcrumbNav from "@/app/components/BreadcrumbNav";
import ProgressBar from "@/app/components/ProgressBar";
import ResourceInteractive from "../../resources/[criterionId]/[guidelineId]/ResourceInteractive";
import EvaluationGuidelineItem from "@/app/components/criteria/EvaluationGuidelineItem";

type SubSubCriterion = {
  Title: string;
  Marks?: number;
  Guidelines_and_Exhibits: {
    Evaluation_Guidelines: string;
    Exhibits_Context_to_be_Observed_Assessed: string;
  };
};

type SubCriterion = {
  Title: string;
  Marks?: number;
  "Sub-Sub-Criteria"?: SubSubCriterion[];
};

type Criterion = {
  Criterion: string;
  Marks?: number;
  "Sub-Criteria": SubCriterion[];
};

const guidelines = guidelinesData as Criterion[];

function findNodeById(id: string) {
  const parts = id.split('-');
  
  if (parts.length >= 1) {
    const cIdx = parseInt(parts[0].replace('c', '')) - 1;
    const criterion = guidelines[cIdx];
    if (!criterion) return null;

    if (parts.length === 1) {
      return { type: 'criterion', data: criterion };
    }

    if (parts.length >= 2) {
      const sIdx = parseInt(parts[1].replace('s', '')) - 1;
      const sub = criterion["Sub-Criteria"][sIdx];
      if (!sub) return null;

      if (parts.length === 2) {
        return { type: 'sub', data: sub, parent: criterion, cId: parts[0] };
      }

      if (parts.length === 3) {
        const ssIdx = parseInt(parts[2].replace('ss', '')) - 1;
        const subSub = sub["Sub-Sub-Criteria"]?.[ssIdx];
        if (!subSub) return null;

        return { type: 'subsub', data: subSub, parent: sub, grandparent: criterion, parentId: `${parts[0]}-${parts[1]}` };
      }
    }
  }
  return null;
}

export default async function CriteriaPage({ params }: { params: Promise<{ id: string, type: string, year: string }> }) {
  const resolvedParams = await params;
  const nodeId = resolvedParams.id;
  const { type = "nba", year = "2025-26" } = resolvedParams;
  const basePath = `/framework/${type}/${year}`;
  
  const node = findNodeById(nodeId);

  if (!node) {
    notFound();
  }

  // Determine parent URL for Back button
  const getParentUrl = () => {
    const parts = nodeId.split('-');
    if (parts.length > 1) {
      parts.pop();
      return `${basePath}/criteria/${parts.join('-')}`;
    }
    return `${basePath}`; // Root dashboard
  };

  const parentUrl = getParentUrl();

  return (
    <article className="animate-in fade-in duration-300">
      {/* Back Button & Breadcrumbs */}
      <div className="mb-8">
        <Link 
          href={parentUrl}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <BreadcrumbNav />
      </div>

      <header className="mb-10 pb-6 border-b border-border">
        {node.type === 'criterion' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                Criterion Overview
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mt-2.5">
                {(node.data as Criterion).Criterion}
              </h1>
            </div>
            <ProgressBar nodeId={nodeId} barWidthClass="w-32 sm:w-44" className="pt-2 sm:pt-0" />
          </div>
        )}
        
        {node.type === 'sub' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                Sub-Criterion
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground mt-1.5">
                {(node.data as SubCriterion).Title}
              </h2>
            </div>
            <ProgressBar nodeId={nodeId} barWidthClass="w-28 sm:w-36" />
          </div>
        )}

        {node.type === 'subsub' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                Sub-Sub-Criterion
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground mt-1.5">
                {(node.data as SubSubCriterion).Title}
              </h2>
            </div>
            <ProgressBar nodeId={nodeId} barWidthClass="w-24 sm:w-32" />
          </div>
        )}
      </header>

      <section className="space-y-8">
        {node.type === 'subsub' && (
          <>
            <div>
              <h3 className="text-lg font-medium tracking-tight mb-4 text-foreground">Evaluation Guidelines</h3>
              <div>
                {(node.data as SubSubCriterion).Guidelines_and_Exhibits.Evaluation_Guidelines.split('\n').map((line, idx) => {
                  if (!line.trim()) return null;
                  
                  const lineMatch = line.match(/^([A-Z])\./);
                  const guidelineId = lineMatch ? lineMatch[1] : (idx + 1).toString();
                  const globalGuidelineId = `${nodeId}-${guidelineId}`;
                  
                  return (
                    <EvaluationGuidelineItem 
                      key={idx}
                      href={`${basePath}/resources/${nodeId}/${guidelineId}`}
                      text={line}
                      guidelineId={globalGuidelineId}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium tracking-tight mb-4 text-foreground">Exhibits & Context to be Observed/Assessed</h3>
              <div className="bg-muted/40 border border-border rounded-xl p-5 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {(node.data as SubSubCriterion).Guidelines_and_Exhibits.Exhibits_Context_to_be_Observed_Assessed || 'No exhibits specified.'}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <ResourceInteractive globalGuidelineId={nodeId} />
            </div>
          </>
        )}

        {node.type === 'criterion' && (
          <div>
            <h3 className="text-lg font-medium tracking-tight mb-4 text-foreground">Sub-components</h3>
            <SubComponentsAccordion items={(node.data as Criterion)["Sub-Criteria"]} parentId={nodeId} />
          </div>
        )}

        {node.type === 'sub' && (
          <div>
            <h3 className="text-lg font-medium tracking-tight mb-4 text-foreground">Detailed Items</h3>
            <div className="border border-border rounded-xl divide-y divide-border bg-card shadow-sm overflow-hidden">
              {(node.data as SubCriterion)["Sub-Sub-Criteria"]?.map((ss, idx) => {
                const ssId = `${nodeId}-ss${idx + 1}`;
                return (
                  <Link 
                    key={idx} 
                    href={`${basePath}/criteria/${ssId}`}
                    className="flex items-center justify-between p-4.5 bg-card transition-colors hover:bg-muted/40 group"
                  >
                    <p className="font-medium text-sm text-foreground group-hover:text-accent transition-colors pr-4 leading-snug">
                      {ss.Title}
                    </p>
                    <ProgressBar nodeId={ssId} barWidthClass="w-20 sm:w-28" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
