"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import SpreadsheetGrid from "@/app/components/SpreadsheetGrid";
import IQACSwocEditor from "@/app/components/iqac/IQACSwocEditor";
import { iqacTableConfigs } from "@/lib/iqacTableConfigs";
import { 
  Table as TableIcon, 
  FileText, 
  Award, 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  Calendar, 
  Users, 
  BookOpen, 
  Layers
} from "lucide-react";

// Organize the 34 tables into clean thematic groups
const TABLE_GROUPS = [
  {
    name: "1. Faculty Information",
    tables: [
      { key: "table_1_faculty_posts", label: "T1: Faculty Posts (Sanctioned/Filled)" },
      { key: "table_2_faculty_profile", label: "T2: Faculty Profile & Qualifications" },
      { key: "table_3_visiting_faculty", label: "T3: Visiting / Adjunct / Emeritus Faculty" },
      { key: "table_4_visiting_faculty_classes", label: "T4: Classes Taken by Visiting Faculty" },
      { key: "table_5_support_staff", label: "T5: Technical & Administrative Support Staff" },
    ],
  },
  {
    name: "2. Research, Projects & Laboratories",
    tables: [
      { key: "table_6_research_thrust_areas", label: "T6: Thrust Areas of Research" },
      { key: "table_7_special_laboratories", label: "T7: Special Research Laboratories" },
      { key: "table_8_budget_expenditure", label: "T8: Budget and Expenditure Details" },
      { key: "table_9_publications", label: "T9: Research Publications of Faculty" },
      { key: "table_10_patents", label: "T10: Patents Filed / Granted" },
      { key: "table_11_projects", label: "T11: Research Projects (External/In-House)" },
    ],
  },
  {
    name: "3. Professional Activities & Consultancy",
    tables: [
      { key: "table_12_professional_memberships", label: "T12: Professional Bodies Membership" },
      { key: "table_13_editorial_boards", label: "T13: Editorial Board Member / Reviewer" },
      { key: "table_14_guest_lectures_delivered", label: "T14: Guest Lectures Delivered Outside" },
      { key: "table_15_sessional_convener", label: "T15: Sessional Convener / Session Chair" },
      { key: "table_16_administrative_responsibilities", label: "T16: Administrative Responsibilities" },
      { key: "table_17_faculty_awards", label: "T17: Awards, Recognitions & Achievements" },
      { key: "table_18_consultancy_revenue", label: "T18: Consultancy Revenue Generated" },
    ],
  },
  {
    name: "4. Academic Programs, FDPs & Workshops",
    tables: [
      { key: "table_19_student_seminars_workshops", label: "T19: Seminars / Workshops Conducted" },
      { key: "table_20_remedial_classes", label: "T20: Remedial Classes for Slow Runners" },
      { key: "table_21_fdp_conducted", label: "T21: FDPs Conducted by Institute" },
      { key: "table_22_fdp_participated", label: "T22: Faculty Deputed to External FDPs" },
      { key: "table_23_eminent_guest_lectures", label: "T23: Guest Lectures by Eminent Speakers" },
      { key: "table_24_crt_programs", label: "T24: Campus Recruitment Training (CRT)" },
      { key: "table_25_placement_drives", label: "T25: Campus Placement Drives Conducted" },
      { key: "table_26_webinars_organized", label: "T26: Webinars Organized" },
    ],
  },
  {
    name: "5. Students Progression & Industry Linkages",
    tables: [
      { key: "table_27_mous", label: "T27: Departmental MoUs Entered" },
      { key: "table_28_student_research_projects", label: "T28: Student Research Projects" },
      { key: "table_29_student_awards", label: "T29: Student Awards & Achievements" },
      { key: "table_30_student_backlogs", label: "T30: Details of Students with Backlogs" },
      { key: "table_31_student_external_seminars", label: "T31: Student External Seminars/Workshops" },
      { key: "table_32_industrial_visits", label: "T32: Student Industrial Visits" },
      { key: "table_33_student_activities", label: "T33: Student Activities (Co/Extra-curricular)" },
      { key: "table_34_alumni_info", label: "T34: Alumni Information & Contribution" },
    ],
  },
];

const ALL_PART_A_TABLES = TABLE_GROUPS.flatMap((g) => g.tables);

export default function IQACDashboardPage() {
  const params = useParams();
  const year = (params?.year as string) || "2025-26";
  const quarter = (params?.quarter as string) || "Q1";

  const [activeTab, setActiveTab] = useState<"part_a" | "swoc" | "part_b" | "part_c">("part_a");
  const [selectedTableKey, setSelectedTableKey] = useState("table_2_faculty_profile");

  const currentTableIndex = ALL_PART_A_TABLES.findIndex((t) => t.key === selectedTableKey);

  const handleNextTable = () => {
    if (currentTableIndex < ALL_PART_A_TABLES.length - 1) {
      setSelectedTableKey(ALL_PART_A_TABLES[currentTableIndex + 1].key);
    }
  };

  const handlePrevTable = () => {
    if (currentTableIndex > 0) {
      setSelectedTableKey(ALL_PART_A_TABLES[currentTableIndex - 1].key);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Banner / Framework Header */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent px-2.5 py-1 rounded-md border border-accent/20">
                IQAC Framework
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider bg-surface-alt text-muted-foreground px-2.5 py-1 rounded-md border border-border">
                {year} • Cycle {quarter}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Academic & Administrative Audit (AAA)
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Internal Quality Assurance Cell (IQAC) • G. Pulla Reddy Engineering College (Autonomous), Kurnool.
              Quarterly performance review for the Department of Mechanical Engineering.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-center">
              <span className="block text-xs font-medium text-muted-foreground">Audit Quarter</span>
              <span className="block text-base font-bold text-accent">{quarter}</span>
            </div>
            <div className="bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-center">
              <span className="block text-xs font-medium text-muted-foreground">Part A Tables</span>
              <span className="block text-base font-bold text-foreground">34 Total</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("part_a")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "part_a"
                ? "bg-accent text-white shadow-sm"
                : "bg-surface-alt text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border"
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Part A: 34 Data Tables</span>
          </button>

          <button
            onClick={() => setActiveTab("swoc")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "swoc"
                ? "bg-accent text-white shadow-sm"
                : "bg-surface-alt text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>SWOC Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab("part_b")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "part_b"
                ? "bg-accent text-white shadow-sm"
                : "bg-surface-alt text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Part B: AAA Department Rubrics</span>
          </button>

          <button
            onClick={() => setActiveTab("part_c")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "part_c"
                ? "bg-accent text-white shadow-sm"
                : "bg-surface-alt text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Part C: AAA Institution Rubrics</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Part A (34 Data Tables) */}
      {activeTab === "part_a" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Table Picker Bar */}
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Table:
              </span>
              <select
                value={selectedTableKey}
                onChange={(e) => setSelectedTableKey(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 text-sm border border-border rounded-lg bg-surface text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                {TABLE_GROUPS.map((group) => (
                  <optgroup key={group.name} label={group.name}>
                    {group.tables.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handlePrevTable}
                disabled={currentTableIndex <= 0}
                className="p-2 border border-border rounded-lg bg-surface-alt text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                title="Previous Table"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-medium text-muted-foreground px-2">
                {currentTableIndex + 1} of {ALL_PART_A_TABLES.length}
              </span>
              <button
                onClick={handleNextTable}
                disabled={currentTableIndex >= ALL_PART_A_TABLES.length - 1}
                className="p-2 border border-border rounded-lg bg-surface-alt text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                title="Next Table"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Render Active Spreadsheet Grid */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <SpreadsheetGrid
              guidelineId={`iqac-part-a-${quarter}`}
              tableKey={selectedTableKey}
            />
          </div>
        </div>
      )}

      {/* Tab Content 2: SWOC Analysis */}
      {activeTab === "swoc" && (
        <div className="animate-in fade-in duration-200">
          <IQACSwocEditor nodeId={`iqac-swoc-${quarter}`} />
        </div>
      )}

      {/* Tab Content 3: Part B AAA Department Assessment */}
      {activeTab === "part_b" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                AAA Peer Review Matrix
              </span>
              <h2 className="text-xl font-bold text-foreground tracking-tight mt-2">
                B. Assessment of the Department by AAA Committee
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Rating Scale: <strong>5 - Excellent</strong> | <strong>4 - Very Good</strong> | <strong>3 - Good</strong> | <strong>2 - Average*</strong> (needs improvisation) | <strong>0 - Incomplete</strong>.
                Pre-populated with all 48 Key Aspects mandated by the GPREC IQAC Manual.
              </p>
            </div>

            <SpreadsheetGrid
              guidelineId={`iqac-part-b-${quarter}`}
              tableKey="part_b_department_assessment"
            />

            {/* Committee Signatures Panel */}
            <div className="mt-10 pt-6 border-t border-border">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                AAA Audit Peer Committee Sign-off
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  "Member-1",
                  "Member-2",
                  "Member-3",
                  "Member-4",
                  "Member-Secretary",
                  "Chairperson",
                ].map((member) => (
                  <div key={member} className="p-3 bg-surface border border-border rounded-xl text-center">
                    <span className="block text-xs font-semibold text-foreground">{member}</span>
                    <span className="block text-[11px] text-muted-foreground mt-1">Pending Signature</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Part C AAA Institution Specific Assessment */}
      {activeTab === "part_c" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                Institution Level Assessment
              </span>
              <h2 className="text-xl font-bold text-foreground tracking-tight mt-2">
                C. Institution Specific Assessment by AAA Committee
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Rating Scale: <strong>5 - Excellent</strong> | <strong>4 - Very Good</strong> | <strong>3 - Good</strong> | <strong>2 - Average*</strong> | <strong>0 - Incomplete</strong>.
                Evaluates college-level administration across all 34 Institutional Key Aspects.
              </p>
            </div>

            <SpreadsheetGrid
              guidelineId={`iqac-part-c-${quarter}`}
              tableKey="part_c_institution_assessment"
            />

            {/* Committee Signatures Panel */}
            <div className="mt-10 pt-6 border-t border-border">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                AAA Committee Executive Endorsement
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  "Member-1",
                  "Member-2",
                  "Member-3",
                  "Member-4",
                  "Member-Secretary",
                  "Chairperson",
                ].map((member) => (
                  <div key={member} className="p-3 bg-surface border border-border rounded-xl text-center">
                    <span className="block text-xs font-semibold text-foreground">{member}</span>
                    <span className="block text-[11px] text-muted-foreground mt-1">Pending Signature</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
