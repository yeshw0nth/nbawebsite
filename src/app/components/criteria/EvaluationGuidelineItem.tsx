"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import StatusIcon from "@/app/components/StatusIcon";

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
      className="flex items-center justify-between p-5 text-gray-600 text-base leading-relaxed hover:bg-[#F3F4F6] transition-colors group"
    >
      <span className="group-hover:text-[#171717] transition-colors">{text}</span>
      <StatusIcon status={currentStatus} />
    </Link>
  );
}
