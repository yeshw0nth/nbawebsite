"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicMatrixWidget, EditableMatrixCell } from "../DynamicMatrixWidget";

// Base columns for C3 PO/PSO tables
const getC3Columns = (): ColumnDef<any, any>[] => [
  { accessorKey: "rowLabel", header: "Item" },
  ...Array.from({ length: 11 }).map((_, i) => ({
    accessorKey: `PO${i + 1}`,
    header: `PO${i + 1}`,
    cell: EditableMatrixCell,
  })),
];

// Table 3.8.1
const initialData381 = [
  { rowLabel: "C101" },
  { rowLabel: "C102" },
  { rowLabel: "..." },
  { rowLabel: "C409" },
  { rowLabel: "Direct Attainment" },
];

export const Table381 = () => (
  <DynamicMatrixWidget title="Table No.3.8.1: PO and PSO attainment value using direct assessment tools." columns={getC3Columns()} initialData={initialData381} />
);

// Table 3.8.2
const initialData382 = [
  { rowLabel: "Survey 1" },
  { rowLabel: "Survey 2" },
  { rowLabel: "Survey 3" },
  { rowLabel: "..." },
  { rowLabel: "Indirect Attainment" },
];

export const Table382 = () => (
  <DynamicMatrixWidget title="Table No. 3.8.2: PO and PSO attainment value using indirect assessment tools." columns={getC3Columns()} initialData={initialData382} />
);

// Table 3.8.3
const initialData383 = [
  { rowLabel: "Direct Attainment" },
  { rowLabel: "Indirect Attainment" },
  { rowLabel: "Overall Attainment" },
];

export const Table383 = () => (
  <DynamicMatrixWidget title="Table No.3.8.3: Overall PO and PSO attainment value" columns={getC3Columns()} initialData={initialData383} />
);
