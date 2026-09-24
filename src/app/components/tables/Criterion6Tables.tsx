"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DynamicTableWidget } from "../DynamicTableWidget";

// A generic factory for creating these simple tables to reduce boilerplate
function createTableWidget(title: string, csvHeaders: string[]) {
  const columns: ColumnDef<any>[] = csvHeaders.map(h => ({
    accessorKey: h,
    header: h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) // Basic camelCase to Title Case
  }));

  return function Widget() {
    const [data, setData] = useState<any[]>([]);

    return (
      <DynamicTableWidget
        title={title}
        columns={columns}
        data={data}
        setData={setData}
        csvTemplateHeaders={csvHeaders}
        renderAddForm={(onSubmit, onCancel) => (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newRecord: any = {};
              csvHeaders.forEach(k => {
                newRecord[k] = formData.get(k) as string;
              });
              onSubmit(newRecord);
            }}
            className="flex flex-col gap-4"
          >
            {csvHeaders.map(header => (
              <div key={header} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">{header}</label>
                <input 
                  name={header}
                  required
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
        )}
      />
    );
  };
}

export const Table6111 = createTableWidget("Table No. 6.1.1.1: Memberships", ["facultyName", "societyBody", "gradePosition"]);
export const Table61211 = createTableWidget("Table No. 6.1.2.1.1: Resource Persons", ["facultyName", "sttpFdp", "date", "location", "organizedBy"]);
export const Table61221 = createTableWidget("Table No. 6.1.2.2.1: Participated in STTP/FDP", ["facultyName", "caym1", "caym2", "caym3"]);
export const Table6131 = createTableWidget("Table No. 6.1.3.1: MOOCs Developed", ["facultyName", "courseName"]);
export const Table6141 = createTableWidget("Table No. 6.1.4.1: MOOCs Certification", ["facultyName", "coursePassed", "agency", "grade"]);
export const Table6151 = createTableWidget("Table No. 6.1.5.1: FDP Organized", ["programName", "date", "duration", "speakerDesignationOrg", "peopleAttended"]);
export const Table6161 = createTableWidget("Table No. 6.1.6.1: Innovative Projects", ["facultyName", "eventName", "date", "place", "website"]);
export const Table6171 = createTableWidget("Table No. 6.1.7.1: Internship/Collaboration", ["facultyName", "internshipDetails", "companyPlace", "duration", "outcomes"]);
export const Table6211 = createTableWidget("Table No. 6.2.1.1: Publications", ["item", "caym1", "caym2", "caym3"]);
export const Table6221 = createTableWidget("Table No. 6.2.2.1: Ph.D. Details", ["item", "caym1", "caym2", "caym3"]);
export const Table6241 = createTableWidget("Table No. 6.2.4.1: Sponsored Research", ["piName", "coPiNames", "deptSanctioned", "projectTitle", "fundingAgency", "duration", "amountLacs"]);
export const Table6251 = createTableWidget("Table No. 6.2.5.1: Consultancy", ["piName", "coPiNames", "deptSanctioned", "projectTitle", "fundingAgency", "duration", "amountLacs"]);
export const Table6261 = createTableWidget("Table No. 6.2.6.1: Seed Money", ["facultyName", "projectTitle", "duration", "amountLacs", "amountUtilized", "outcomes"]);
