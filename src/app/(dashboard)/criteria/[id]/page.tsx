import guidelinesData from "@/data/guidelines.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import SubComponentsAccordion from "./SubComponentsAccordion";
import RadialProgress from "@/app/components/RadialProgress";
import FormulaCalculator from "@/app/components/calculators/FormulaCalculator";

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

export default async function CriteriaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const nodeId = resolvedParams.id;
  const node = findNodeById(nodeId);

  if (!node) {
    notFound();
  }

  // Determine parent URL for Back button
  const getParentUrl = () => {
    const parts = nodeId.split('-');
    if (parts.length > 1) {
      parts.pop();
      return `/criteria/${parts.join('-')}`;
    }
    return '/'; // Root
  };

  const parentUrl = getParentUrl();

  // Determine Breadcrumbs
  const breadcrumbs = [];
  if (node.type === 'criterion') {
    breadcrumbs.push((node.data as Criterion).Criterion);
  } else if (node.type === 'sub') {
    breadcrumbs.push((node.parent as Criterion).Criterion);
    breadcrumbs.push((node.data as SubCriterion).Title);
  } else if (node.type === 'subsub') {
    breadcrumbs.push((node.grandparent as Criterion).Criterion);
    breadcrumbs.push((node.parent as SubCriterion).Title);
    breadcrumbs.push((node.data as SubSubCriterion).Title);
  }

  return (
    <article className="animate-in fade-in duration-300">
      {/* Back Button & Breadcrumbs */}
      <div className="mb-8">
        <Link 
          href={parentUrl}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#171717] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={idx === breadcrumbs.length - 1 ? "text-[#171717] font-medium" : "text-gray-500"}>
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && <ChevronRight size={14} />}
            </div>
          ))}
        </div>
      </div>

      <header className="mb-12 border-b border-gray-100 pb-8">
        {node.type === 'criterion' && (
          <RadialProgress criterionId={nodeId} title={(node.data as Criterion).Criterion} />
        )}
        
        {node.type === 'sub' && (
          <>
            <div className="flex items-start justify-between mb-3 gap-6">
              <h2 className="text-2xl font-semibold tracking-tight text-[#171717]">{(node.data as SubCriterion).Title}</h2>
              <span className="bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full text-sm shrink-0 mt-1">
                {(node.data as SubCriterion).Marks} Marks
              </span>
            </div>
          </>
        )}

        {node.type === 'subsub' && (
          <>
            <div className="flex items-start justify-between mb-3 gap-6">
              <h2 className="text-2xl font-semibold tracking-tight text-[#171717]">{(node.data as SubSubCriterion).Title}</h2>
              <span className="bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full text-sm shrink-0 mt-1">
                {(node.data as SubSubCriterion).Marks} Marks
              </span>
            </div>
          </>
        )}
      </header>

      <section className="space-y-8">
        {node.type === 'subsub' && (
          <>
            <div>
              <h3 className="text-lg font-medium tracking-tight mb-4 text-[#171717]">Evaluation Guidelines</h3>
              <div className="border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                {(node.data as SubSubCriterion).Guidelines_and_Exhibits.Evaluation_Guidelines.split('\n').map((line, idx) => {
                  if (!line.trim()) return null;
                  
                  const lineMatch = line.match(/^([A-Z])\./);
                  const guidelineId = lineMatch ? lineMatch[1] : (idx + 1).toString();
                  
                  return (
                    <Link
                      key={idx}
                      href={`/resources/${nodeId}/${guidelineId}`}
                      className="block p-5 text-gray-600 text-base leading-relaxed hover:bg-[#F3F4F6] transition-colors"
                    >
                      {line}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium tracking-tight mb-4 text-[#171717]">Exhibits & Context to be Observed/Assessed</h3>
              <div className="border border-gray-200 rounded-lg p-5 bg-white text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                {(node.data as SubSubCriterion).Guidelines_and_Exhibits.Exhibits_Context_to_be_Observed_Assessed || 'No exhibits specified.'}
              </div>
            </div>
          </>
        )}

        {node.type === 'criterion' && (
          <div>
            <h3 className="text-lg font-medium tracking-tight mb-4 text-[#171717]">Sub-components</h3>
            <SubComponentsAccordion items={(node.data as Criterion)["Sub-Criteria"]} parentId={nodeId} />
          </div>
        )}

        {node.type === 'sub' && (
          <div>
            <FormulaCalculator nodeId={nodeId} maxMarks={(node.data as SubCriterion).Marks} />
            <h3 className="text-lg font-medium tracking-tight mb-4 text-[#171717]">Detailed Items</h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
              {(node.data as SubCriterion)["Sub-Sub-Criteria"]?.map((ss, idx) => (
                <Link 
                  key={idx} 
                  href={`/criteria/${nodeId}-ss${idx + 1}`}
                  className="flex items-center justify-between p-5 bg-white transition-colors hover:bg-indigo-50 group"
                >
                  <p className="font-medium text-sm text-[#171717] group-hover:text-indigo-600 transition-colors">{ss.Title}</p>
                  <span className="text-sm text-gray-500 font-medium shrink-0 ml-4 group-hover:text-indigo-500 transition-colors">{ss.Marks} Marks</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
