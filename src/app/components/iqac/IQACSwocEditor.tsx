"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";
import RichTextEditor from "@/app/components/RichTextEditor";
import { Pencil, Save, Check, Loader2, Sparkles, FileText } from "lucide-react";

const DEFAULT_SWOC_TEMPLATE = `<h3>i. Strengths</h3>
<p>• Highly qualified faculty with substantial teaching and research experience.</p>
<p>• Well-equipped laboratories with advanced machinery and CAD/CAM computing software.</p>
<p>• Strong student mentoring and academic counseling mechanism.</p>

<h3>ii. Weaknesses</h3>
<p>• Revenue generation through external industrial consultancy requires further scale.</p>
<p>• International research collaborations and funded major research projects.</p>

<h3>iii. Opportunities</h3>
<p>• Interdisciplinary research in Additive Manufacturing, Robotics, and Renewable Energy.</p>
<p>• Establishing joint training centers with core mechanical manufacturing firms.</p>

<h3>iv. Challenges</h3>
<p>• Rapid evolution of Industry 4.0 and automation requiring continuous curriculum upgrades.</p>
<p>• Enhancing core mechanical engineering campus recruitment packages.</p>

<h3>v. Best Practices / Innovations</h3>
<p>• Structured remedial classes for slow learners and honors/minors for advanced learners.</p>
<p>• Hands-on project exhibitions and student technical magazine publications.</p>

<h3>vi. Future Plans</h3>
<p>• Establish an AICTE/DST funded Centre of Excellence in Advanced Materials & Robotics.</p>
<p>• File minimum 10+ patents annually with commercial technology transfer.</p>`;

export default function IQACSwocEditor({ nodeId = "iqac-swoc" }: { nodeId?: string }) {
  const { notes, updateNote } = useProgress();
  const currentNote = notes[nodeId] || "";

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(currentNote || DEFAULT_SWOC_TEMPLATE);
  }, [currentNote]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateNote(nodeId, content);
    setIsSaving(false);
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLoadTemplate = () => {
    setContent(DEFAULT_SWOC_TEMPLATE);
    setIsEditing(true);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              SWOC Analysis
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Strengths, Weaknesses, Opportunities & Challenges (including Best Practices and Future Plans)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={handleLoadTemplate}
              className="px-3 py-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-1.5"
              title="Reset to official GPREC template"
            >
              <Sparkles size={14} />
              Reset Template
            </button>
          )}

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-accent text-white px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-accent-hover transition-colors disabled:opacity-70 shadow-sm"
              >
                {isSaving ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={14} /> Save SWOC</>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-accent text-white px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Pencil size={14} />
              Edit SWOC
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
          <Check size={14} />
          SWOC Analysis successfully saved to accreditation nodes!
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Document Strengths, Weaknesses, Opportunities, Challenges, Best Practices, and Future Plans..."
          />
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 prose prose-sm max-w-none text-foreground leading-relaxed">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-muted-foreground italic">No SWOC analysis provided yet. Click &quot;Edit SWOC&quot; to begin.</p>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-muted-foreground gap-2">
        <span>Head of the Department (HoD) Sign-off</span>
        <span className="font-medium text-foreground">Department of Mechanical Engineering, GPREC</span>
      </div>
    </div>
  );
}
