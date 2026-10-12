"use client";

import { useProgress } from "@/context/ProgressContext";

interface ProgressBarProps {
  nodeId?: string;
  completed?: number;
  total?: number;
  percentage?: number;
  className?: string;
  barWidthClass?: string;
  showFraction?: boolean;
}

export default function ProgressBar({
  nodeId,
  completed: propCompleted,
  total: propTotal,
  percentage: propPercentage,
  className = "",
  barWidthClass = "w-24 sm:w-28",
  showFraction = true
}: ProgressBarProps) {
  const { getNodeProgress } = useProgress();

  let completed = propCompleted ?? 0;
  let total = propTotal ?? 0;
  let percentage = propPercentage ?? 0;

  if (nodeId) {
    const progress = getNodeProgress(nodeId);
    completed = progress.completed;
    total = progress.total;
    percentage = progress.percentage;
  }

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {/* Horizontal Bar */}
      <div className={`${barWidthClass} h-2 bg-muted/70 rounded-full overflow-hidden border border-border/40`}>
        <div
          className="h-full bg-accent transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      {/* Text Fraction */}
      {showFraction && (
        <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
          {completed}/{total} Completed
        </span>
      )}
    </div>
  );
}
