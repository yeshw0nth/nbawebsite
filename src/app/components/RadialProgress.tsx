"use client";

import { useScore } from "@/context/ScoreContext";
import { useEffect, useState } from "react";

export default function RadialProgress({ criterionId, title }: { criterionId: string; title: string }) {
  const { getCriterionScore, getMaxMarks } = useScore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const score = getCriterionScore(criterionId);
  const max = getMaxMarks(criterionId);
  const percentage = max > 0 ? (score / max) * 100 : 0;
  
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-6 p-6 bg-white border border-zinc-200 rounded-xl shadow-sm mb-8">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-zinc-100"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-indigo-600 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-sm font-bold text-zinc-900">{Math.round(percentage)}%</span>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h2>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold tracking-tight text-indigo-600">{score.toFixed(1)}</span>
          <span className="text-sm font-medium text-zinc-500">/ {max} Marks</span>
        </div>
        <p className="text-sm text-zinc-500 mt-1">Self-Assessed Score</p>
      </div>
    </div>
  );
}
