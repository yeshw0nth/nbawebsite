"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BookOpen, ShieldCheck, ArrowRight, Calendar, CheckCircle2, Clock } from "lucide-react";

const ACADEMIC_YEARS = [
  "2025-26",
  "2026-27",
  "2027-28",
  "2028-29",
  "2029-30",
  "2030-31",
  "2031-32",
  "2032-33",
  "2033-34",
  "2034-35"
];

const AUDIT_QUARTERS = [
  { id: "Q1", label: "Q1 (July-Sept)" },
  { id: "Q2", label: "Q2 (Oct-Dec)" },
  { id: "Q3", label: "Q3 (Jan-Mar)" },
  { id: "Q4", label: "Q4 (Apr-June)" }
];

const FRAMEWORKS = [
  {
    id: "nba",
    name: "NBA",
    title: "National Board of Accreditation",
    description: "Tier-I Outcome-Based Education (OBE) evaluation metrics, SAR compliance, and live evidence management.",
    icon: Award,
    available: true,
  },
  {
    id: "naac",
    name: "NAAC",
    title: "National Assessment & Accreditation Council",
    description: "Institutional quality assessment, Self-Study Report (SSR) rubrics, and continuous quality audits.",
    icon: BookOpen,
    available: true,
  },
  {
    id: "iqac",
    name: "IQAC",
    title: "Internal Quality Assurance Cell",
    description: "Quarterly Academic and Administrative Audit (AAA), 34 data tables, SWOC analysis, and committee rubrics.",
    icon: ShieldCheck,
    available: true,
  }
];

export default function FrameworkSelectionPage() {
  const router = useRouter();
  const [selectedFramework, setSelectedFramework] = useState("nba");
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");

  const handleEnterWorkspace = (frameworkId: string) => {
    if (frameworkId.toLowerCase() === "iqac") {
      router.push(`/framework/iqac/${selectedYear}/${selectedQuarter}`);
    } else {
      router.push(`/framework/${frameworkId.toLowerCase()}/${selectedYear}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl"
      >
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide uppercase mb-4">
            Autonomous Institution • Accredited by NAAC & NBA
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            G. Pulla Reddy Engineering College
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto font-medium">
            Mechanical Engineering Department - Centralized Accreditation System
          </p>
        </div>

        {/* Configuration Bar: Academic Year & Conditional IQAC Audit Cycle */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Target Academic Year:</span>
            </div>
            <div className="w-full sm:w-auto">
              <select
                id="academic-year-selector"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-2 text-sm border border-border rounded-lg bg-surface text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
              >
                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Audit Cycle for IQAC */}
          <AnimatePresence>
            {selectedFramework === "iqac" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-4 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-accent">
                  <Clock className="w-4 h-4" />
                  <span>Audit Cycle (Quarterly):</span>
                </div>
                <div className="w-full sm:w-auto">
                  <select
                    id="audit-cycle-selector"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="w-full sm:w-56 px-3.5 py-2 text-sm border border-accent/40 rounded-lg bg-accent/5 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
                  >
                    {AUDIT_QUARTERS.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Framework Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FRAMEWORKS.map((fw) => {
            const Icon = fw.icon;
            const isSelected = selectedFramework === fw.id;

            return (
              <motion.div
                key={fw.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedFramework(fw.id)}
                className={`border rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all shadow-sm ${
                  isSelected 
                    ? "bg-card border-accent ring-2 ring-accent/30 shadow-md" 
                    : "bg-card/70 border-border hover:border-accent/50 hover:bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isSelected ? "bg-accent text-white" : "bg-muted/40 text-muted-foreground"}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    {fw.name}
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {fw.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {fw.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnterWorkspace(fw.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? "bg-accent hover:bg-accent-hover text-white shadow-sm"
                        : "bg-surface-alt hover:bg-accent hover:text-white text-foreground border border-border"
                    }`}
                  >
                    <span>
                      Enter {fw.name} {fw.id === "iqac" ? `(${selectedQuarter})` : ""}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          Mechanical Engineering Accreditation Portal • G. Pulla Reddy Engineering College (Autonomous), Kurnool
        </p>
      </motion.div>
    </div>
  );
}
