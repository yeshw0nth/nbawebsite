"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import guidelinesData from "@/data/guidelines.json";

export type Status = "pending" | "ongoing" | "completed";

interface ProgressContextType {
  statuses: Record<string, Status>;
  notes: Record<string, string>;
  updateStatus: (nodeId: string, status: Status) => void;
  updateNote: (guidelineId: string, note: string) => void;
  getNodeStatus: (nodeId: string) => Status;
  isSubSubCompleted: (ssId: string) => boolean;
  totalSubSubs: number;
  completedSubSubs: number;
  ongoingSubSubs: number;
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
    
    if (savedStatuses) {
      try {
        const parsed = JSON.parse(savedStatuses);
        // Map old statuses if they exist
        const mapped: Record<string, Status> = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (v === "Not Started") mapped[k] = "pending";
          else if (v === "In Progress") mapped[k] = "ongoing";
          else if (v === "Completed") mapped[k] = "completed";
          else mapped[k] = v as Status;
        }
        setStatuses(mapped);
      } catch (e) {
        console.error("Failed to parse statuses", e);
      }
    }
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("guideline_statuses", JSON.stringify(statuses));
      localStorage.setItem("guideline_notes", JSON.stringify(notes));
    }
  }, [statuses, notes, isLoaded]);

  const updateStatus = (nodeId: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [nodeId]: status }));
  };

  const updateNote = (guidelineId: string, note: string) => {
    setNotes(prev => ({ ...prev, [guidelineId]: note }));
  };

  const getNodeStatus = (nodeId: string): Status => {
    // If it's a leaf node (or specifically set), return its status directly
    if (statuses[nodeId]) {
      return statuses[nodeId];
    }
    
    // Check if it's a parent node (e.g., c1, c1-s1)
    const childrenKeys = Object.keys(statuses).filter(k => k.startsWith(nodeId + "-"));
    if (childrenKeys.length > 0) {
      const childrenStatuses = childrenKeys.map(k => statuses[k]);
      const allCompleted = childrenStatuses.every(s => s === "completed");
      const someOngoingOrCompleted = childrenStatuses.some(s => s === "ongoing" || s === "completed");
      
      if (allCompleted) return "completed";
      if (someOngoingOrCompleted) return "ongoing";
    }

    return "pending";
  };

  const isSubSubCompleted = (ssId: string) => {
    return getNodeStatus(ssId) === "completed";
  };

  // Calculate total SubSubs (leaf nodes)
  let total = 0;
  guidelinesData.forEach(c => {
    c["Sub-Criteria"].forEach(s => {
      total += s["Sub-Sub-Criteria"]?.length || 0;
    });
  });

  // Calculate completed and ongoing SubSubs
  let completedCount = 0;
  let ongoingCount = 0;
  
  guidelinesData.forEach(c => {
    c["Sub-Criteria"].forEach(s => {
      s["Sub-Sub-Criteria"]?.forEach(ss => {
        const status = getNodeStatus(ss.id);
        if (status === "completed") {
          completedCount++;
        } else if (status === "ongoing") {
          ongoingCount++;
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
      getNodeStatus,
      isSubSubCompleted,
      totalSubSubs: total,
      completedSubSubs: completedCount,
      ongoingSubSubs: ongoingCount
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
