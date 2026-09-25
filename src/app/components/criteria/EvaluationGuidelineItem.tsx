"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import StatusIcon from "@/app/components/StatusIcon";
import { ChevronRight } from "lucide-react";

interface EvaluationGuidelineItemProps {
  href: string;
  text: string;
  guidelineId: string;
}

export default function EvaluationGuidelineItem({ href, text, guidelineId }: EvaluationGuidelineItemProps) {
  const { getNodeStatus } = useProgress();
  const currentStatus = getNodeStatus(guidelineId);

  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-5 mb-3 flex items-center justify-between cursor-pointer group transition-all duration-200 hover:border-accent hover:shadow-md"
    >
      <span className="text-foreground transition-colors">{text}</span>
      <div className="flex items-center gap-4">
        <StatusIcon status={currentStatus} />
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
    </Link>
  );
}
