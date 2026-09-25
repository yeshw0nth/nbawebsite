"use client";

import React, { useState, useEffect, useRef } from "react";
import { DataSheetGrid, textColumn, keyColumn, Column } from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";
import { useProgress } from "@/context/ProgressContext";
import { Save, Check, Loader2, Undo, Redo, Plus, Trash2, X, FileDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [selection, setSelection] = useState<any>(null);

  // History state for undo/redo
  const [history, setHistory] = useState<any[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalChange = useRef(false);

  // Define Columns & Titles
  let columns: (Column<any, any> & { accessorKey?: string })[] = [];
  let tableTitle = "Evaluation Data Grid";

  if (tableKey === "1.1.5.1" || tableKey === "1.1.5") {
    tableTitle = "Table 1.1.5.1: Mapping of PEOs with Mission";
    columns = [
      { ...keyColumn("peo", textColumn), title: "PEO Statements", accessorKey: "peo" },
      { ...keyColumn("m1", textColumn), title: "M1", accessorKey: "m1" },
      { ...keyColumn("m2", textColumn), title: "M2", accessorKey: "m2" },
      { ...keyColumn("m3", textColumn), title: "M3", accessorKey: "m3" },
      { ...keyColumn("m4", textColumn), title: "M4", accessorKey: "m4" },
      { ...keyColumn("m5", textColumn), title: "M5", accessorKey: "m5" },
    ];
  } else if (tableKey === "1.4.2") {
    tableTitle = "Table 1.4.2: Course outcomes mapping";
    columns = [
      { ...keyColumn("course", textColumn), title: "Course", accessorKey: "course" },
      { ...keyColumn("po1", textColumn), title: "PO1", accessorKey: "po1" },
      { ...keyColumn("po2", textColumn), title: "PO2", accessorKey: "po2" },
      { ...keyColumn("po3", textColumn), title: "PO3", accessorKey: "po3" },
    ];
  } else if (tableKey === "3.8.1") {
    tableTitle = "Table 3.8.1: Attainment of POs/PSOs";
    columns = [
      { ...keyColumn("course", textColumn), title: "Course", accessorKey: "course" },
      { ...keyColumn("attainment", textColumn), title: "Attainment", accessorKey: "attainment" },
    ];
  } else if (tableKey === "4A-4C" || tableKey === "4A" || tableKey === "4") {
    tableTitle = "Table 4: Student Enrollment";
    columns = [
      { ...keyColumn("year", textColumn), title: "Year", accessorKey: "year" },
      { ...keyColumn("ca", textColumn), title: "CA", accessorKey: "ca" },
      { ...keyColumn("cb", textColumn), title: "CB", accessorKey: "cb" },
      { ...keyColumn("cc", textColumn), title: "CC", accessorKey: "cc" },
    ];
  } else if (tableKey === "5A") {
    tableTitle = "Table 5A: Faculty details";
    columns = [
      { ...keyColumn("name", textColumn), title: "Name", accessorKey: "name" },
      { ...keyColumn("pan", textColumn), title: "PAN", accessorKey: "pan" },
      { ...keyColumn("apaar", textColumn), title: "APAAR ID", accessorKey: "apaar" },
      { ...keyColumn("highestDegree", textColumn), title: "Highest Degree", accessorKey: "highestDegree" },
      { ...keyColumn("university", textColumn), title: "University", accessorKey: "university" },
      { ...keyColumn("specialization", textColumn), title: "Specialization", accessorKey: "specialization" },
      { ...keyColumn("dojInstitution", textColumn), title: "DOJ (Inst.)", accessorKey: "dojInstitution" },
      { ...keyColumn("dojDepartment", textColumn), title: "DOJ (Dept.)", accessorKey: "dojDepartment" },
      { ...keyColumn("experience", textColumn), title: "Experience (Yrs)", accessorKey: "experience" },
      { ...keyColumn("designationAtJoining", textColumn), title: "Desig. (Joining)", accessorKey: "designationAtJoining" },
      { ...keyColumn("presentDesignation", textColumn), title: "Desig. (Present)", accessorKey: "presentDesignation" },
      { ...keyColumn("dateDesignatedProf", textColumn), title: "Date Desig. Prof", accessorKey: "dateDesignatedProf" },
      { ...keyColumn("natureOfAssociation", textColumn), title: "Nature of Assoc.", accessorKey: "natureOfAssociation" },
      { ...keyColumn("contractualType", textColumn), title: "Contractual Type", accessorKey: "contractualType" },
      { ...keyColumn("currentlyAssociated", textColumn), title: "Currently Assoc.", accessorKey: "currentlyAssociated" },
      { ...keyColumn("dateOfLeaving", textColumn), title: "Date of Leaving", accessorKey: "dateOfLeaving" },
    ];
  } else if (tableKey === "9.7.1") {
    tableTitle = "Table 9.7.1: Mentoring System";
    columns = [
      { ...keyColumn("facility", textColumn), title: "Facility", accessorKey: "facility" },
      { ...keyColumn("details", textColumn), title: "Details", accessorKey: "details" },
      { ...keyColumn("reason", textColumn), title: "Reason", accessorKey: "reason" },
      { ...keyColumn("utilization", textColumn), title: "Utilization", accessorKey: "utilization" },
    ];
  } else {
    tableTitle = `Table ${tableKey}`;
    columns = [
      { ...keyColumn("col1", textColumn), title: "Item", accessorKey: "col1" },
      { ...keyColumn("col2", textColumn), title: "Value", accessorKey: "col2" },
      { ...keyColumn("col3", textColumn), title: "Notes", accessorKey: "col3" },
    ];
  }

  // Initialization
  useEffect(() => {
    let defaultData = Array(5).fill({});
    const contextData = tableData?.[guidelineId]?.[tableKey];
    const initialData = (contextData && Array.isArray(contextData) && contextData.length > 0) 
      ? contextData 
      : defaultData;

    setGridData(initialData);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, [guidelineId, tableKey, tableData]);

  const handleGridChange = (newData: any[]) => {
    setGridData(newData);
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      setHistoryIndex(historyIndex - 1);
      setGridData(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      setHistoryIndex(historyIndex + 1);
      setGridData(history[historyIndex + 1]);
    }
  };

  const handleAddRow = () => {
    const newData = [...gridData, {}];
    handleGridChange(newData);
  };

  const handleDeleteRow = () => {
    if (selection && selection.min && selection.min.row !== undefined) {
      const newData = [...gridData];
      newData.splice(selection.min.row, selection.max.row - selection.min.row + 1);
      handleGridChange(newData);
    } else if (gridData.length > 0) {
      const newData = gridData.slice(0, -1);
      handleGridChange(newData);
    }
  };

  const handleClearGrid = () => {
    const newData = Array(5).fill({});
    handleGridChange(newData);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(tableTitle, 14, 15);
    
    const head = [columns.map(c => c.title)];
    const body = gridData.map(row => columns.map(c => row[c.accessorKey || ""] || ""));
    
    autoTable(doc, {
      startY: 20,
      head: head as any,
      body: body as any,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`${tableKey.replace(/[^a-zA-Z0-9]/g, "_")}_NBA_Export.pdf`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    const nodeUuid = await ensureNodeExists(guidelineId);

    const { error } = await supabase
      .from("dynamic_tables")
      .upsert({
        node_uuid: nodeUuid,
        table_id: tableKey,
        payload: gridData
      } as any, { onConflict: "node_uuid,table_id" });

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
      
      {/* Title & Save */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground tracking-tight">{tableTitle}</h4>
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

      {/* Spreadsheet Toolbar */}
      <div className="flex items-center justify-between p-2 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors disabled:opacity-50" title="Undo">
            <Undo size={16} />
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors disabled:opacity-50" title="Redo">
            <Redo size={16} />
          </button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <button onClick={handleAddRow} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors flex items-center gap-1 text-sm font-medium" title="Add Row">
            <Plus size={16} /> Add Row
          </button>
          <button onClick={handleDeleteRow} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors flex items-center gap-1 text-sm font-medium" title="Delete Selected Row">
            <Trash2 size={16} /> Delete Row
          </button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <button onClick={handleClearGrid} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors flex items-center gap-1 text-sm font-medium" title="Clear Grid">
            <X size={16} /> Clear Grid
          </button>
        </div>
        <div className="flex items-center">
          <button onClick={exportToPDF} className="p-1.5 hover:bg-muted text-accent hover:text-accent-hover rounded transition-colors flex items-center gap-1 text-sm font-medium" title="Export to PDF">
            <FileDown size={16} /> Export to PDF
          </button>
        </div>
      </div>

      <div className="spreadsheet-grid-wrapper overflow-hidden rounded-md border border-border">
        <DataSheetGrid
          value={gridData}
          onChange={handleGridChange}
          columns={columns}
          autoAddRow
          onSelectionChange={setSelection as any}
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
