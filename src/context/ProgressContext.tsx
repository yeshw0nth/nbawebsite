"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import guidelinesData from "@/data/guidelines.json";

export type Status = "pending" | "ongoing" | "completed";

interface ProgressContextType {
  statuses: Record<string, Status>;
  notes: Record<string, string>;
  tableData: Record<string, Record<string, any>>;
  updateStatus: (nodeId: string, status: Status) => void;
  updateNote: (guidelineId: string, note: string) => void;
  updateTableData: (guidelineId: string, tableId: string, data: any) => void;
  getNodeStatus: (nodeId: string) => Status;
  isSubSubCompleted: (ssId: string) => boolean;
  totalSubSubs: number;
  completedSubSubs: number;
  ongoingSubSubs: number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const computeTableStatus = (data: any): Status => {
  if (!data) return "pending";
  if (Array.isArray(data)) {
    if (data.length === 0) return "pending";
    const allValues = data.flatMap(obj => Object.values(obj));
    const hasEmptyString = allValues.some(v => v === "");
    const hasAnyValue = allValues.some(v => v !== "");
    
    if (hasEmptyString && hasAnyValue) return "ongoing";
    if (hasEmptyString && !hasAnyValue) return "pending";
    return "completed";
  } else if (typeof data === "object") {
    // Type 3 calc table (nested objects with 0s)
    let hasData = false;
    const checkObj = (obj: any) => {
      for (const val of Object.values(obj)) {
        if (typeof val === "object" && val !== null) {
          checkObj(val);
        } else if (val !== 0 && val !== "" && val !== null) {
          hasData = true;
        }
      }
    };
    checkObj(data);
    return hasData ? "completed" : "pending";
  }
  return "pending";
};

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tableData, setTableData] = useState<Record<string, Record<string, any>>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedStatuses = localStorage.getItem("guideline_statuses");
    const savedNotes = localStorage.getItem("guideline_notes");
    const savedTableData = localStorage.getItem("guideline_table_data");
    
    if (savedStatuses) {
      try {
        const parsed = JSON.parse(savedStatuses);
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
      try { setNotes(JSON.parse(savedNotes)); } catch (e) {}
    }
    if (savedTableData) {
      try { setTableData(JSON.parse(savedTableData)); } catch (e) {}
    }
    
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("guideline_statuses", JSON.stringify(statuses));
      localStorage.setItem("guideline_notes", JSON.stringify(notes));
      localStorage.setItem("guideline_table_data", JSON.stringify(tableData));
    }
  }, [statuses, notes, tableData, isLoaded]);

  const updateStatus = (nodeId: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [nodeId]: status }));
  };

  const updateNote = (guidelineId: string, note: string) => {
    setNotes(prev => ({ ...prev, [guidelineId]: note }));
  };

  const updateTableData = (guidelineId: string, tableId: string, data: any) => {
    setTableData(prev => {
      const nextGuidelineTables = { ...prev[guidelineId], [tableId]: data };
      const next = { ...prev, [guidelineId]: nextGuidelineTables };
      
      // Compute Rollup
      const tableStatuses = Object.values(nextGuidelineTables).map(computeTableStatus);
      let newStatus: Status = "pending";
      if (tableStatuses.every(s => s === "completed")) {
        newStatus = "completed";
      } else if (tableStatuses.some(s => s === "ongoing" || s === "completed")) {
        newStatus = "ongoing";
      }
      
      // We asynchronously update the status to prevent race conditions during render
      setTimeout(() => updateStatus(guidelineId, newStatus), 0);
      
      return next;
    });
  };

  const getNodeStatus = (nodeId: string): Status => {
    if (statuses[nodeId]) {
      return statuses[nodeId];
    }
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

  let total = 0;
  guidelinesData.forEach(c => {
    c["Sub-Criteria"].forEach(s => {
      total += s["Sub-Sub-Criteria"]?.length || 0;
    });
  });

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
      tableData,
      updateStatus,
      updateNote,
      updateTableData,
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
