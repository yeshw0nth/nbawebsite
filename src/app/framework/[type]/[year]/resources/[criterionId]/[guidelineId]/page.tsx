import Link from "next/link";
import { ArrowLeft, FileText, Link as LinkIcon, StickyNote, Plus } from "lucide-react";
import guidelinesData from "@/data/guidelines.json";
import { notFound } from "next/navigation";
import ResourceInteractive from "./ResourceInteractive";

// Reuse the types locally for simplicity
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

function findSubSubCriterionById(id: string) {
  const parts = id.split('-');
  if (parts.length === 3) {
    const cIdx = parseInt(parts[0].replace('c', '')) - 1;
    const sIdx = parseInt(parts[1].replace('s', '')) - 1;
    const ssIdx = parseInt(parts[2].replace('ss', '')) - 1;
    
    return guidelines[cIdx]?.["Sub-Criteria"]?.[sIdx]?.["Sub-Sub-Criteria"]?.[ssIdx] || null;
  }
  return null;
}

export default async function ResourcePage({ 
  params 
}: { 
  params: Promise<{ criterionId: string; guidelineId: string; type: string; year: string }> 
}) {
  const resolvedParams = await params;
  const { criterionId, guidelineId, type = "nba", year = "2025-26" } = resolvedParams;
  
  const subSubCriterion = findSubSubCriterionById(criterionId);
  
  if (!subSubCriterion) {
    notFound();
  }

  // Find the specific guideline line
  const lines = subSubCriterion.Guidelines_and_Exhibits.Evaluation_Guidelines.split('\n');
  const guidelineText = lines.find((line, idx) => {
    const lineMatch = line.match(/^([A-Z])\./);
    const gId = lineMatch ? lineMatch[1] : (idx + 1).toString();
    return gId === guidelineId;
  }) || "Guideline not found.";

  return (
    <article className="animate-in fade-in duration-300">
      <div className="mb-8">
        <Link 
          href={`/framework/${type}/${year}/criteria/${criterionId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Criterion
        </Link>
        <div className="text-sm text-muted">
          Context and Resources for Guideline <span className="font-medium text-foreground">{guidelineId}</span>
        </div>
      </div>

      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-relaxed">
          {guidelineText}
        </h2>
      </header>

      <ResourceInteractive globalGuidelineId={`${criterionId}-${guidelineId}`} />
    </article>
  );
}
