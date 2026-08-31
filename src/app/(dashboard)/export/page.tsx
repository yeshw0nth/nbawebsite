"use client";

import { useScore } from "@/context/ScoreContext";
import { useProgress } from "@/context/ProgressContext";
import guidelinesData from "@/data/guidelines.json";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ExportPage() {
  const { scores, getCriterionScore, getMaxMarks } = useScore();
  const { statuses, notes } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto print when loaded
    if (mounted) {
      setTimeout(() => window.print(), 500);
    }
  }, [mounted]);

  if (!mounted) return <div className="p-10">Preparing Audit Report...</div>;

  const totalScore = guidelinesData.reduce((acc, c) => acc + getCriterionScore(c.id), 0);

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white print:p-0">
      <div className="text-center mb-10 border-b-2 border-zinc-900 pb-6">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">SAR Compliance Audit Report</h1>
        <p className="text-zinc-600">Generated on {new Date().toLocaleDateString()}</p>
        <div className="mt-6 inline-block bg-zinc-100 px-6 py-3 rounded-lg">
          <span className="text-lg font-medium text-zinc-600">Total Self-Assessed Score: </span>
          <span className="text-2xl font-bold text-indigo-700">{totalScore.toFixed(1)} / 1000</span>
        </div>
      </div>

      <div className="space-y-12">
        {guidelinesData.map(c => {
          const cScore = getCriterionScore(c.id);
          const cMax = getMaxMarks(c.id);
          
          return (
            <section key={c.id} className="break-inside-avoid">
              <div className="flex justify-between items-center bg-zinc-100 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold text-zinc-900">{c.Criterion}</h2>
                <span className="font-bold text-indigo-700">{cScore.toFixed(1)} / {cMax}</span>
              </div>
              
              <div className="space-y-6 pl-4 border-l-2 border-zinc-200 ml-2">
                {c["Sub-Criteria"].map(s => {
                  return (
                    <div key={s.id}>
                      <h3 className="text-lg font-semibold text-zinc-800">{s.Title}</h3>
                      <div className="mt-3 space-y-4">
                        {s["Sub-Sub-Criteria"]?.map(ss => {
                          const status = statuses[ss.id] || "Not Started";
                          const note = notes[ss.id];
                          const score = scores[ss.id] || 0;
                          
                          return (
                            <div key={ss.id} className="bg-white border border-zinc-200 p-4 rounded-md">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-zinc-900 max-w-[70%]">{ss.Title}</h4>
                                <div className="text-right">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    status === "Completed" ? "bg-indigo-50 text-indigo-700" :
                                    status === "In Progress" ? "bg-amber-50 text-amber-700" :
                                    "bg-zinc-100 text-zinc-600"
                                  }`}>{status}</span>
                                  <div className="mt-2 text-sm font-bold text-zinc-700">
                                    Score: {score} / {ss.Marks}
                                  </div>
                                </div>
                              </div>
                              
                              {note && (
                                <div className="mt-4 pt-4 border-t border-zinc-100">
                                  <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Review Notes</h5>
                                  <div className="prose prose-sm prose-zinc">
                                    <ReactMarkdown>{note}</ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
