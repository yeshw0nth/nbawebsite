"use client";

import React, { useState, useEffect } from "react";
import { DataSheetGrid, textColumn, keyColumn, Column } from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";
import { useProgress } from "@/context/ProgressContext";
import { Save, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function SpreadsheetGrid({ 
  guidelineId,
  tableKey,
}: { 
  guidelineId: string,
  tableKey: string
}) {
  const { ensureNodeExists, tableData, updateTableData } = useProgress();
  const params = useParams();
  const frameworkType = (params?.type as string) || "NBA";
  const academicYear = (params?.year as string) || "2025-26";
  
  const [gridData, setGridData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Define Columns
  let columns: Column<any, any>[] = [];
  if (tableKey === "5A") {
    columns = [
      { ...keyColumn("name", textColumn), title: "Name" },
      { ...keyColumn("pan", textColumn), title: "PAN" },
      { ...keyColumn("apaar", textColumn), title: "APAAR ID" },
      { ...keyColumn("highestDegree", textColumn), title: "Highest Degree" },
      { ...keyColumn("university", textColumn), title: "University" },
      { ...keyColumn("specialization", textColumn), title: "Specialization" },
      { ...keyColumn("dojInstitution", textColumn), title: "DOJ (Inst.)" },
      { ...keyColumn("dojDepartment", textColumn), title: "DOJ (Dept.)" },
      { ...keyColumn("experience", textColumn), title: "Experience (Yrs)" },
      { ...keyColumn("designationAtJoining", textColumn), title: "Desig. (Joining)" },
      { ...keyColumn("presentDesignation", textColumn), title: "Desig. (Present)" },
      { ...keyColumn("dateDesignatedProf", textColumn), title: "Date Desig. Prof" },
      { ...keyColumn("natureOfAssociation", textColumn), title: "Nature of Assoc." },
      { ...keyColumn("contractualType", textColumn), title: "Contractual Type" },
      { ...keyColumn("currentlyAssociated", textColumn), title: "Currently Assoc." },
      { ...keyColumn("dateOfLeaving", textColumn), title: "Date of Leaving" },
    ];
  } else {
    columns = [
      { ...keyColumn("col1", textColumn), title: "Column 1" },
      { ...keyColumn("col2", textColumn), title: "Column 2" },
    ];
  }

  // Initialization
  useEffect(() => {
    let defaultData = Array(5).fill({});
    
    // Check if we have data in context
    const contextData = tableData?.[guidelineId]?.[tableKey];
    if (contextData && Array.isArray(contextData) && contextData.length > 0) {
      setGridData(contextData);
    } else {
      // Initialize with 5 empty rows
      setGridData(defaultData);
    }
  }, [guidelineId, tableKey, tableData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    // Make sure the node exists in accreditation_nodes
    const nodeUuid = await ensureNodeExists(guidelineId);

    // Save directly to dynamic_tables using the raw payload as requested
    const { error } = await supabase
      .from("dynamic_tables")
      .upsert({
        node_uuid: nodeUuid,
        table_id: tableKey,
        payload: gridData
      } as any, { onConflict: "node_uuid,table_id" });

    // Also update the progress context purely for client sync
    updateTableData(guidelineId, tableKey, gridData);

    setIsSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground tracking-tight">Spreadsheet Data</h4>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-accent text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check size={16} /> Saved!</>
          ) : (
            <><Save size={16} /> Save Spreadsheet</>
          )}
        </button>
      </div>

      <div className="spreadsheet-grid-wrapper overflow-hidden rounded-md border border-border">
        <DataSheetGrid
          value={gridData}
          onChange={setGridData}
          columns={columns}
          autoAddRow
        />
        <style dangerouslySetInnerHTML={{__html: `
          .spreadsheet-grid-wrapper .dsg-container {
            --dsg-border-color: var(--color-border);
            --dsg-cell-background-color: var(--color-card);
            --dsg-header-text-color: var(--color-muted);
            --dsg-selection-border-color: var(--color-accent);
            --dsg-row-background-color: var(--color-card);
            --dsg-scroll-shadow-color: transparent;
            --dsg-font-family: inherit;
          }
          .spreadsheet-grid-wrapper .dsg-row {
            color: var(--color-foreground);
          }
          .spreadsheet-grid-wrapper .dsg-cell {
            background-color: var(--color-card);
          }
          .spreadsheet-grid-wrapper .dsg-cell-header {
            background-color: var(--color-surface-alt);
            font-weight: 500;
            font-size: 0.875rem;
            color: var(--color-muted);
          }
          .spreadsheet-grid-wrapper .dsg-scrollable-view-t.dsg-scrollable-view-b {
            box-shadow: none !important;
          }
          .spreadsheet-grid-wrapper .dsg-scrollable-view-l,
          .spreadsheet-grid-wrapper .dsg-scrollable-view-r,
          .spreadsheet-grid-wrapper .dsg-scrollable-view-t,
          .spreadsheet-grid-wrapper .dsg-scrollable-view-b {
            box-shadow: none !important;
          }
        `}} />
      </div>
    </div>
  );
}
