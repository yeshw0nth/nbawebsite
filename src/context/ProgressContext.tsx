"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import guidelinesData from "@/data/guidelines.json";
import { useParams, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export type Status = "pending" | "ongoing" | "completed";

export type NodeProgress = {
  total: number;
  completed: number;
  percentage: number;
};

interface ProgressContextType {
  statuses: Record<string, Status>;
  notes: Record<string, string>;
  tableData: Record<string, Record<string, any>>;
  updateStatus: (nodeId: string, status: Status) => void;
  updateNote: (guidelineId: string, note: string) => void;
  updateTableData: (guidelineId: string, tableId: string, data: any) => void;
  getNodeStatus: (nodeId: string) => Status;
  getNodeProgress: (nodeId: string) => NodeProgress;
  isSubSubCompleted: (ssId: string) => boolean;
  totalSubSubs: number;
  completedSubSubs: number;
  ongoingSubSubs: number;
  ensureNodeExists: (nodeId: string, overrideStatus?: Status, overrideNotes?: string) => Promise<string>;
  quarter?: string;
  framework?: string;
  year?: string;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Map of any node ID (criterion, sub, sub-sub) to its array of leaf guideline IDs (A, B, C...)
const nodeToLeavesMap: Record<string, string[]> = {};

(guidelinesData as any[]).forEach(c => {
  const cId = c.id;
  if (!nodeToLeavesMap[cId]) nodeToLeavesMap[cId] = [];

  c["Sub-Criteria"]?.forEach((s: any) => {
    const sId = s.id;
    if (!nodeToLeavesMap[sId]) nodeToLeavesMap[sId] = [];

    (s["Sub-Sub-Criteria"] || []).forEach((ss: any) => {
      const ssId = ss.id;
      if (!nodeToLeavesMap[ssId]) nodeToLeavesMap[ssId] = [];

      const lines = (ss.Guidelines_and_Exhibits?.Evaluation_Guidelines || "")
        .split("\n")
        .filter((l: string) => l.trim());

      lines.forEach((l: string, idx: number) => {
        const match = l.match(/^([A-Z])\./);
        const gId = match ? match[1] : (idx + 1).toString();
        const leafId = `${ssId}-${gId}`;

        nodeToLeavesMap[ssId].push(leafId);
        nodeToLeavesMap[sId].push(leafId);
        nodeToLeavesMap[cId].push(leafId);
      });
    });
  });
});

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
  const params = useParams();
  const pathname = usePathname();

  // Dynamic Framework and Quarterly Cycle resolution
  const isIqac = (params?.type as string)?.toLowerCase() === "iqac" || pathname?.includes("/iqac/");
  const rawFramework = (params?.type as string) || (isIqac ? "IQAC" : "NBA");
  const frameworkType = rawFramework.toUpperCase();

  // If path is /framework/iqac/[year]/[quarter], parse parameters cleanly
  const pathSegments = pathname ? pathname.split("/").filter(Boolean) : [];
  const rawYear = (params?.year as string) || (isIqac && pathSegments[2] ? pathSegments[2] : "2025-26");
  const quarter = (params?.quarter as string) || (isIqac && pathSegments[3] ? pathSegments[3] : "");

  // For IQAC, concatenate year and quarter (e.g., 2025-26-Q1) to reuse the exact same DB schema without SQL changes
  const academicYear = isIqac && quarter ? `${rawYear}-${quarter}` : rawYear;

  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tableData, setTableData] = useState<Record<string, Record<string, any>>>({});
  const [nodeUuids, setNodeUuids] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Use refs to access latest state in async callbacks without creating dependency cycles
  const stateRef = useRef({ statuses, notes, nodeUuids });
  useEffect(() => {
    stateRef.current = { statuses, notes, nodeUuids };
  }, [statuses, notes, nodeUuids]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoaded(false);
      
      const { data: nodesData } = await supabase
        .from("accreditation_nodes")
        .select("id, node_id, status, introductory_notes")
        .eq("framework", frameworkType)
        .eq("academic_year", academicYear);
        
      const { data: tablesData } = await supabase
        .from("dynamic_spreadsheets")
        .select("table_identifier, grid_payload, accreditation_nodes!inner(framework, academic_year, node_id)")
        .eq("accreditation_nodes.framework", frameworkType)
        .eq("accreditation_nodes.academic_year", academicYear);

      if (!isMounted) return;

      const newStatuses: Record<string, Status> = {};
      const newNotes: Record<string, string> = {};
      const newNodeUuids: Record<string, string> = {};
      
      if (nodesData) {
        nodesData.forEach((n: any) => {
          newStatuses[n.node_id] = n.status;
          if (n.introductory_notes) newNotes[n.node_id] = n.introductory_notes;
          newNodeUuids[n.node_id] = n.id;
        });
      }

      const newTableData: Record<string, Record<string, any>> = {};
      if (tablesData) {
        tablesData.forEach((row: any) => {
          const nodeId = row.accreditation_nodes.node_id;
          if (!newTableData[nodeId]) newTableData[nodeId] = {};
          newTableData[nodeId][row.table_identifier] = row.grid_payload;
        });
      }

      setStatuses(newStatuses);
      setNotes(newNotes);
      setNodeUuids(newNodeUuids);
      setTableData(newTableData);
      setIsLoaded(true);
    };

    fetchData();

    return () => { isMounted = false; };
  }, [frameworkType, academicYear]);

  const ensureNodeExists = async (nodeId: string, overrideStatus?: Status, overrideNotes?: string): Promise<string> => {
    const currentState = stateRef.current;
    
    const payload = {
      framework: frameworkType,
      academic_year: academicYear,
      node_id: nodeId,
      status: overrideStatus ?? (currentState.statuses[nodeId] || "pending"),
      introductory_notes: overrideNotes ?? (currentState.notes[nodeId] || null)
    };

    const { data, error } = await supabase
      .from("accreditation_nodes")
      .upsert(payload as any, { onConflict: "framework,academic_year,node_id" })
      .select("id")
      .single();
      
    if (data) {
      const rowData = data as any;
      setNodeUuids(prev => ({ ...prev, [nodeId]: rowData.id }));
      return rowData.id;
    }
    return currentState.nodeUuids[nodeId] || "";
  };

  const updateStatus = async (nodeId: string, status: Status) => {
    // Optimistic UI Update
    setStatuses(prev => ({ ...prev, [nodeId]: status }));
    
    // Background Async Sync
    if (isLoaded) {
      await ensureNodeExists(nodeId, status, undefined);
    }
  };

  const updateNote = async (guidelineId: string, note: string) => {
    // Optimistic UI Update
    setNotes(prev => ({ ...prev, [guidelineId]: note }));
    
    // Background Async Sync
    if (isLoaded) {
      await ensureNodeExists(guidelineId, undefined, note);
    }
  };

  const updateTableData = async (guidelineId: string, tableId: string, data: any) => {
    // Optimistic UI Update
    setTableData(prev => {
      const nextGuidelineTables = { ...prev[guidelineId], [tableId]: data };
      const next = { ...prev, [guidelineId]: nextGuidelineTables };
      
      const tableStatuses = Object.values(nextGuidelineTables).map(computeTableStatus);
      let newStatus: Status = "pending";
      if (tableStatuses.every(s => s === "completed")) {
        newStatus = "completed";
      } else if (tableStatuses.some(s => s === "ongoing" || s === "completed")) {
        newStatus = "ongoing";
      }
      
      setTimeout(() => updateStatus(guidelineId, newStatus), 0);
      return next;
    });

    // Background Async Sync
    if (isLoaded) {
      const nodeUuid = await ensureNodeExists(guidelineId);
      if (nodeUuid) {
        await supabase
          .from("dynamic_spreadsheets")
          .upsert({
            node_uuid: nodeUuid,
            table_identifier: tableId,
            grid_payload: data
          } as any, { onConflict: "node_uuid,table_identifier" });
      }
    }
  };

  const getNodeStatus = (nodeId: string): Status => {
    if (statuses[nodeId]) return statuses[nodeId];
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

  const getNodeProgress = (nodeId: string): NodeProgress => {
    const leaves = nodeToLeavesMap[nodeId];
    if (!leaves || leaves.length === 0) {
      const isCompleted = statuses[nodeId] === "completed";
      return {
        total: 1,
        completed: isCompleted ? 1 : 0,
        percentage: isCompleted ? 100 : 0
      };
    }

    let completed = 0;
    for (const leafId of leaves) {
      if (statuses[leafId] === "completed") {
        completed++;
      }
    }

    const total = leaves.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const isSubSubCompleted = (ssId: string) => getNodeStatus(ssId) === "completed";

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
      getNodeProgress,
      isSubSubCompleted,
      totalSubSubs: total,
      completedSubSubs: completedCount,
      ongoingSubSubs: ongoingCount,
      ensureNodeExists,
      quarter,
      framework: frameworkType,
      year: rawYear
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
