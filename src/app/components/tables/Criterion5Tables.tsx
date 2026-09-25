"use client";

import { useState } from "react";
type ColumnDef<T, V=any> = any;
import { DynamicTableWidget } from "../DynamicTableWidget";

// Table 5A: Faculty details
export type Faculty5A = {
  name: string;
  pan: string;
  apaar: string;
  highestDegree: string;
  university: string;
  specialization: string;
  dojInstitution: string;
  dojDepartment: string;
  experience: number;
  designationAtJoining: string;
  presentDesignation: string;
  dateDesignatedProf: string;
  natureOfAssociation: string;
  contractualType: string;
  currentlyAssociated: string;
  dateOfLeaving: string;
};

const columns5A: ColumnDef<Faculty5A>[] = [
  { accessorKey: "name", header: "Name of the Faculty" },
  { accessorKey: "pan", header: "PAN No." },
  { accessorKey: "apaar", header: "APAAR faculty ID" },
  { accessorKey: "highestDegree", header: "Highest degree" },
  { accessorKey: "university", header: "University" },
  { accessorKey: "specialization", header: "Area of Specialization" },
  { accessorKey: "dojInstitution", header: "Joining Date (Inst.)" },
  { accessorKey: "dojDepartment", header: "Joining Date (Dept.)" },
  { accessorKey: "experience", header: "Experience (years)" },
  { accessorKey: "designationAtJoining", header: "Desig. at Joining" },
  { accessorKey: "presentDesignation", header: "Present Desig." },
  { accessorKey: "dateDesignatedProf", header: "Date Designated Prof/Assoc" },
  { accessorKey: "natureOfAssociation", header: "Nature of Assoc." },
  { accessorKey: "contractualType", header: "Contractual Type" },
  { accessorKey: "currentlyAssociated", header: "Currently Assoc." },
  { accessorKey: "dateOfLeaving", header: "Date of Leaving" },
];

const csvHeaders5A = [
  "name", "pan", "apaar", "highestDegree", "university", "specialization",
  "dojInstitution", "dojDepartment", "experience", "designationAtJoining",
  "presentDesignation", "dateDesignatedProf", "natureOfAssociation",
  "contractualType", "currentlyAssociated", "dateOfLeaving"
];

import SpreadsheetGrid from "../SpreadsheetGrid";

export function Table5AWidget({ guidelineId }: { guidelineId?: string }) {
  if (!guidelineId) return null;
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-foreground">Table No. 5A: Faculty details</h3>
        <p className="text-sm text-muted-foreground mt-1">Copy and paste your faculty roster directly from Excel.</p>
      </div>
      <SpreadsheetGrid guidelineId={guidelineId} tableKey="5A" />
    </div>
  );
}
