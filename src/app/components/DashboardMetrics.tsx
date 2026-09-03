"use client";

import { useProgress } from "@/context/ProgressContext";
import guidelinesData from "@/data/guidelines.json";

export default function DashboardMetrics() {
  const { totalSubSubs, completedSubSubs, ongoingSubSubs, getNodeStatus } = useProgress();
  const pendingSubSubs = totalSubSubs - completedSubSubs - ongoingSubSubs;

  const getCriterionStats = (cId: string) => {
    let total = 0;
    let completed = 0;
    let ongoing = 0;

    const criterion = (guidelinesData as any[]).find(c => c.id === cId);
    criterion?.["Sub-Criteria"]?.forEach((s: any) => {
      s["Sub-Sub-Criteria"]?.forEach((ss: any) => {
        total++;
        const status = getNodeStatus(ss.id);
        if (status === "completed") completed++;
        else if (status === "ongoing") ongoing++;
      });
    });

    return { total, completed, ongoing, pending: total - completed - ongoing };
  };

  // SVGs for Donut Chart
  const radius = 60;
  const stroke = 24;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const completedRatio = totalSubSubs > 0 ? completedSubSubs / totalSubSubs : 0;
  const ongoingRatio = totalSubSubs > 0 ? ongoingSubSubs / totalSubSubs : 0;

  const completedDashOffset = circumference - completedRatio * circumference;
  const ongoingDashOffset = circumference - ongoingRatio * circumference;

  // We rotate the ongoing segment so it starts after the completed segment
  const ongoingRotation = completedRatio * 360 - 90;

  return (
    <div className="mb-10 space-y-6 animate-fade-in">
      {/* Legend & Global Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="relative flex items-center justify-center shrink-0">
          <svg height={radius * 2} width={radius * 2}>
            {/* Background Pending Circle */}
            <circle
              stroke="var(--color-surface-alt)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Ongoing Segment */}
            {ongoingRatio > 0 && (
              <circle
                stroke="var(--color-accent)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: ongoingDashOffset, transformOrigin: '50% 50%', transform: `rotate(${ongoingRotation}deg)` }}
                strokeLinecap="butt"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            )}
            {/* Completed Segment */}
            {completedRatio > 0 && (
              <circle
                stroke="#059669" /* Emerald-600 */
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: completedDashOffset, transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
                strokeLinecap="butt"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-foreground">{Math.round(completedRatio * 100)}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Global Framework Progress</h2>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-sm font-medium text-foreground">{completedSubSubs} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm font-medium text-foreground">{ongoingSubSubs} Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-surface-alt border border-border" />
              <span className="text-sm font-medium text-muted">{pendingSubSubs} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Criteria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(guidelinesData as any[]).map((c, i) => {
          const stats = getCriterionStats(c.id);
          const pComp = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
          const pOng = stats.total > 0 ? (stats.ongoing / stats.total) * 100 : 0;
          const pPend = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;

          return (
            <div key={c.id} className="bg-surface p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
              <div className="mb-4">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Criterion {i + 1}</span>
                <h3 className="text-sm font-medium text-foreground line-clamp-1 mt-1" title={c.Criterion}>{c.Criterion}</h3>
              </div>
              
              <div className="w-full h-2 rounded-full flex overflow-hidden bg-surface-alt">
                {pComp > 0 && <div style={{ width: `${pComp}%` }} className="bg-emerald-600 h-full" />}
                {pOng > 0 && <div style={{ width: `${pOng}%` }} className="bg-accent h-full" />}
                {pPend > 0 && <div style={{ width: `${pPend}%` }} className="bg-surface-alt h-full" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
