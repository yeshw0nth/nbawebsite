"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import guidelinesData from "@/data/guidelines.json";

interface ScoreContextType {
  scores: Record<string, number>;
  updateScore: (id: string, score: number) => void;
  getMaxMarks: (id: string) => number;
  getCriterionScore: (cId: string) => number;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sar_scores");
    if (saved) {
      setScores(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sar_scores", JSON.stringify(scores));
    }
  }, [scores, isLoaded]);

  const updateScore = (id: string, score: number) => {
    setScores(prev => ({ ...prev, [id]: score }));
  };

  const getMaxMarks = (id: string) => {
    let max = 0;
    guidelinesData.forEach(c => {
      if (c.id === id) max = c.Marks;
      c["Sub-Criteria"].forEach(s => {
        if (s.id === id) max = s.Marks;
        s["Sub-Sub-Criteria"]?.forEach(ss => {
          if (ss.id === id) max = ss.Marks;
        });
      });
    });
    return max;
  };

  const getCriterionScore = (cId: string) => {
    let total = 0;
    guidelinesData.forEach(c => {
      if (c.id === cId) {
        c["Sub-Criteria"].forEach(s => {
          s["Sub-Sub-Criteria"]?.forEach(ss => {
            if (scores[ss.id]) total += scores[ss.id];
          });
          // If a sub-criterion has no sub-sub-criteria, its own score matters
          if (!s["Sub-Sub-Criteria"] || s["Sub-Sub-Criteria"].length === 0) {
            if (scores[s.id]) total += scores[s.id];
          }
        });
      }
    });
    return total;
  };

  return (
    <ScoreContext.Provider value={{ scores, updateScore, getMaxMarks, getCriterionScore }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
}
