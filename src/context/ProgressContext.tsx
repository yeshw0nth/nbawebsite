"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import guidelinesData from "@/data/guidelines.json";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
  ensureNodeExists: (nodeId: string, overrideStatus?: Status, overrideNotes?: string) => Promise<string>;
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
  const frameworkType = (params?.type as string) || "NBA";
  const academicYear = (params?.year as string) || "2025-26";

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
        .select("id, node_id, status, user_notes")
        .eq("framework_type", frameworkType)
        .eq("academic_year", academicYear);
        
      const { data: tablesData } = await supabase
        .from("dynamic_tables")
        .select("table_id, payload, accreditation_nodes!inner(framework_type, academic_year, node_id)")
        .eq("accreditation_nodes.framework_type", frameworkType)
        .eq("accreditation_nodes.academic_year", academicYear);

      if (!isMounted) return;

      const newStatuses: Record<string, Status> = {};
      const newNotes: Record<string, string> = {};
      const newNodeUuids: Record<string, string> = {};
      
      if (nodesData) {
        nodesData.forEach((n: any) => {
          newStatuses[n.node_id] = n.status;
          if (n.user_notes) newNotes[n.node_id] = n.user_notes;
          newNodeUuids[n.node_id] = n.id;
        });
      }

      const newTableData: Record<string, Record<string, any>> = {};
      if (tablesData) {
        tablesData.forEach((row: any) => {
          const nodeId = row.accreditation_nodes.node_id;
          if (!newTableData[nodeId]) newTableData[nodeId] = {};
          newTableData[nodeId][row.table_id] = row.payload;
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
      framework_type: frameworkType,
      academic_year: academicYear,
      node_id: nodeId,
      status: overrideStatus ?? (currentState.statuses[nodeId] || "pending"),
      user_notes: overrideNotes ?? (currentState.notes[nodeId] || null)
    };

    const { data, error } = await supabase
      .from("accreditation_nodes")
      .upsert(payload as any, { onConflict: "framework_type,academic_year,node_id" })
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
          .from("dynamic_tables")
          .upsert({
            node_uuid: nodeUuid,
            table_id: tableId,
            payload: data
          } as any, { onConflict: "node_uuid,table_id" });
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
      isSubSubCompleted,
      totalSubSubs: total,
      completedSubSubs: completedCount,
      ongoingSubSubs: ongoingCount,
      ensureNodeExists
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
