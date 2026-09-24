"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
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

export function Table5AWidget() {
  const [data, setData] = useState<Faculty5A[]>([]);

  return (
    <DynamicTableWidget
      title="Table No. 5A: Faculty details"
      columns={columns5A}
      data={data}
      setData={setData}
      csvTemplateHeaders={csvHeaders5A}
      renderAddForm={(onSubmit, onCancel) => {
        // Render a generic vertical form based on csvHeaders5A for simplicity
        return (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newRecord: any = {};
              csvHeaders5A.forEach(k => {
                newRecord[k] = formData.get(k) as string;
              });
              onSubmit(newRecord);
            }}
            className="flex flex-col gap-4"
          >
            {csvHeaders5A.map(header => (
              <div key={header} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">{header}</label>
                <input 
                  name={header}
                  required={header === "name" || header === "pan"}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface-alt text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t border-border mt-2">
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-surface-alt text-muted hover:text-foreground rounded-md transition-colors text-sm font-medium border border-border"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-accent text-white hover:bg-accent-hover rounded-md transition-colors text-sm font-medium"
              >
                Save Record
              </button>
            </div>
          </form>
        );
      }}
    />
  );
}
