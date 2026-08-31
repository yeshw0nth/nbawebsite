"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import guidelinesData from "@/data/guidelines.json";

type Status = "Not Started" | "In Progress" | "Completed";

interface ProgressContextType {
  statuses: Record<string, Status>;
  notes: Record<string, string>;
  updateStatus: (guidelineId: string, status: Status) => void;
  updateNote: (guidelineId: string, note: string) => void;
  isSubSubCompleted: (ssId: string) => boolean;
  totalSubSubs: number;
  completedSubSubs: number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedStatuses = localStorage.getItem("guideline_statuses");
    const savedNotes = localStorage.getItem("guideline_notes");
    
    if (savedStatuses) setStatuses(JSON.parse(savedStatuses));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("guideline_statuses", JSON.stringify(statuses));
      localStorage.setItem("guideline_notes", JSON.stringify(notes));
    }
  }, [statuses, notes, isLoaded]);

  const updateStatus = (guidelineId: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [guidelineId]: status }));
  };

  const updateNote = (guidelineId: string, note: string) => {
    setNotes(prev => ({ ...prev, [guidelineId]: note }));
  };

  // Helper to check if a SubSubCriterion is completely done
  // We consider it done if ALL its guidelines are marked 'Completed'
  // Or simpler: if ANY guideline is 'Completed'. Let's say if it has ANY completed guideline, we mark it completed for the tree to feel responsive.
  const isSubSubCompleted = (ssId: string) => {
    // Find the SubSubCriterion to see its guidelines
    // In our app, guideline IDs are passed as A, B, C, etc. But to make them unique globally, 
    // the UI uses `{criterionId}/{guidelineId}` in the URL. So the true ID is `ssId-guidelineId`.
    // Let's check all statuses that start with this `ssId`.
    const relatedStatuses = Object.entries(statuses).filter(([key]) => key.startsWith(ssId + '-'));
    if (relatedStatuses.length === 0) return false;
    
    // Check if at least one is completed (or all). Let's go with "at least one" for quick feedback.
    return relatedStatuses.some(([_, status]) => status === "Completed");
  };

  // Calculate total SubSubs (leaf nodes)
  let total = 0;
  guidelinesData.forEach(c => {
    c["Sub-Criteria"].forEach(s => {
      total += s["Sub-Sub-Criteria"]?.length || 0;
    });
  });

  // Calculate completed SubSubs
  let completedCount = 0;
  guidelinesData.forEach(c => {
    c["Sub-Criteria"].forEach(s => {
      s["Sub-Sub-Criteria"]?.forEach(ss => {
        if (isSubSubCompleted(ss.id)) {
          completedCount++;
        }
      });
    });
  });

  return (
    <ProgressContext.Provider value={{
      statuses,
      notes,
      updateStatus,
      updateNote,
      isSubSubCompleted,
      totalSubSubs: total,
      completedSubSubs: completedCount
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
