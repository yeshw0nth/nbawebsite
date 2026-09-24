"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicMatrixWidget, EditableMatrixCell } from "../DynamicMatrixWidget";

// Table 1.1.5.1
const columns1151: ColumnDef<any, any>[] = [
  { accessorKey: "peo", header: "PEO Statements" },
  ...Array.from({ length: 5 }).map((_, i) => ({
    accessorKey: `M${i + 1}`,
    header: `M${i + 1}`,
    cell: EditableMatrixCell,
  })),
];
const initialData1151 = [
  { peo: "PEO1", M1: "", M2: "", M3: "", M4: "", M5: "" },
  { peo: "PEO2", M1: "", M2: "", M3: "", M4: "", M5: "" },
  { peo: "PEON", M1: "", M2: "", M3: "", M4: "", M5: "" },
];

export const Table1151 = () => (
  <DynamicMatrixWidget title="Table No. 1.1.5.1: Mapping of PEOs with mission." columns={columns1151} initialData={initialData1151} />
);

// Table 1.4.2
const columns142: ColumnDef<any, any>[] = [
  { accessorKey: "co", header: "Course Outcomes (COs)" },
  ...Array.from({ length: 11 }).map((_, i) => ({
    accessorKey: `PO${i + 1}`,
    header: `PO${i + 1}`,
    cell: EditableMatrixCell,
  })),
  { accessorKey: "PSO1", header: "PSO1", cell: EditableMatrixCell },
  { accessorKey: "PSO2", header: "PSO2", cell: EditableMatrixCell },
];
const initialData142 = [
  { co: "CO-1" },
  { co: "CO-2" },
  { co: "CO-3" },
  { co: "CO-4" },
  { co: "CO-5" },
];

export const Table142 = () => (
  <DynamicMatrixWidget title="Table No.1.4.2: Course articulation matrix." columns={columns142} initialData={initialData142} />
);

// Table 1.5.1
const columns151: ColumnDef<any, any>[] = [
  { accessorKey: "course", header: "Course Code & Name" },
  ...Array.from({ length: 11 }).map((_, i) => ({
    accessorKey: `PO${i + 1}`,
    header: `PO${i + 1}`,
    cell: EditableMatrixCell,
  })),
];
const initialData151 = [
  { course: "C101" },
  { course: "C202" },
  { course: "C303" },
  { course: "C409" },
];

export const Table151 = () => (
  <DynamicMatrixWidget title="Table No.1.5.1: Program articulation matrix" columns={columns151} initialData={initialData151} />
);
