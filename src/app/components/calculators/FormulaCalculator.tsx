"use client";

import React, { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useScore } from "@/context/ScoreContext";

export default function FormulaCalculator({ nodeId, maxMarks }: { nodeId: string; maxMarks: number }) {
  const { updateScore } = useScore();

  // 4.6 Placement, Higher Studies
  if (nodeId === "c4-s6") {
    const [placed, setPlaced] = useState<number>(0);
    const [higherStudies, setHigherStudies] = useState<number>(0);
    const [totalStudents, setTotalStudents] = useState<number>(0);

    const P = totalStudents > 0 ? (placed + higherStudies) / totalStudents : 0;
    const score = Math.min(maxMarks, P * 30); // Example simple formula

    useEffect(() => {
      updateScore(nodeId, score);
    }, [score]);

    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 my-6 shadow-sm">
        <h3 className="text-lg font-medium tracking-tight mb-4 text-zinc-900">Placement Index Calculator</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Placed Students (X)</label>
            <input type="number" value={placed || ''} onChange={e => setPlaced(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Higher Studies (Y)</label>
            <input type="number" value={higherStudies || ''} onChange={e => setHigherStudies(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Total Students (N)</label>
            <input type="number" value={totalStudents || ''} onChange={e => setTotalStudents(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
        </div>
        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-4">
          <BlockMath math={`P = \\frac{X + Y}{N} = \\frac{${placed} + ${higherStudies}}{${totalStudents || 1}} = ${P.toFixed(2)}`} />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-sm font-medium text-zinc-600">Calculated Marks</span>
          <span className="text-xl font-bold text-indigo-600">{score.toFixed(1)} <span className="text-sm text-zinc-400 font-normal">/ {maxMarks}</span></span>
        </div>
      </div>
    );
  }

  // 5.1 Student-Faculty Ratio
  if (nodeId === "c5-s1") {
    const [students, setStudents] = useState<number>(0);
    const [faculty, setFaculty] = useState<number>(0);

    const SFR = faculty > 0 ? students / faculty : 0;
    const score = SFR > 0 && SFR <= 15 ? 30 : SFR <= 20 ? 20 : SFR <= 25 ? 10 : 0; // Example NBA logic

    useEffect(() => {
      updateScore(nodeId, score);
    }, [score]);

    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 my-6 shadow-sm">
        <h3 className="text-lg font-medium tracking-tight mb-4 text-zinc-900">SFR Calculator</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Total Students</label>
            <input type="number" value={students || ''} onChange={e => setStudents(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Total Faculty</label>
            <input type="number" value={faculty || ''} onChange={e => setFaculty(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
        </div>
        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-4 text-center">
          <BlockMath math={`SFR = \\frac{Students}{Faculty} = \\frac{${students}}{${faculty || 1}} = ${SFR.toFixed(2)}`} />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-sm font-medium text-zinc-600">Calculated Marks</span>
          <span className="text-xl font-bold text-indigo-600">{score.toFixed(1)} <span className="text-sm text-zinc-400 font-normal">/ {maxMarks}</span></span>
        </div>
      </div>
    );
  }

  // 5.2 Faculty Qualification
  if (nodeId === "c5-s2") {
    const [phd, setPhd] = useState<number>(0);
    const [mtech, setMtech] = useState<number>(0);
    const [reqFaculty, setReqFaculty] = useState<number>(0);

    const FQI = reqFaculty > 0 ? (10 * phd + 6 * mtech) / reqFaculty : 0;
    const score = Math.min(maxMarks, FQI * 2.5); // Example NBA logic multiplier

    useEffect(() => {
      updateScore(nodeId, score);
    }, [score]);

    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 my-6 shadow-sm">
        <h3 className="text-lg font-medium tracking-tight mb-4 text-zinc-900">Faculty Qualification Index (FQI)</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Ph.D Faculty (X)</label>
            <input type="number" value={phd || ''} onChange={e => setPhd(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">M.Tech Faculty (Y)</label>
            <input type="number" value={mtech || ''} onChange={e => setMtech(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Required Faculty (RF)</label>
            <input type="number" value={reqFaculty || ''} onChange={e => setReqFaculty(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
        </div>
        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-4">
          <BlockMath math={`FQI = \\frac{10X + 6Y}{RF} = \\frac{10(${phd}) + 6(${mtech})}{${reqFaculty || 1}} = ${FQI.toFixed(2)}`} />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-sm font-medium text-zinc-600">Calculated Marks</span>
          <span className="text-xl font-bold text-indigo-600">{score.toFixed(1)} <span className="text-sm text-zinc-400 font-normal">/ {maxMarks}</span></span>
        </div>
      </div>
    );
  }

  // 5.3 Faculty Cadre Proportion
  if (nodeId === "c5-s3") {
    const [prof, setProf] = useState<number>(0);
    const [assoc, setAssoc] = useState<number>(0);
    const [asst, setAsst] = useState<number>(0);
    const [rf, setRf] = useState<number>(0);

    const cp = rf > 0 ? ((prof / (rf / 9)) + (assoc / (rf * 2 / 9)) + (asst / (rf * 6 / 9))) * 10 : 0;
    const score = Math.min(maxMarks, cp);

    useEffect(() => {
      updateScore(nodeId, score);
    }, [score]);

    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 my-6 shadow-sm">
        <h3 className="text-lg font-medium tracking-tight mb-4 text-zinc-900">Cadre Proportion Calculator</h3>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Professors</label>
            <input type="number" value={prof || ''} onChange={e => setProf(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Assoc. Profs</label>
            <input type="number" value={assoc || ''} onChange={e => setAssoc(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Asst. Profs</label>
            <input type="number" value={asst || ''} onChange={e => setAsst(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Req. Faculty (RF)</label>
            <input type="number" value={rf || ''} onChange={e => setRf(Number(e.target.value))} className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-600 outline-none" />
          </div>
        </div>
        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-4 overflow-x-auto">
          <BlockMath math={`CP = \\left(\\frac{AF1}{RF1} + \\frac{AF2}{RF2} + \\frac{AF3}{RF3}\\right) \\times 10 = ${cp.toFixed(2)}`} />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-sm font-medium text-zinc-600">Calculated Marks</span>
          <span className="text-xl font-bold text-indigo-600">{score.toFixed(1)} <span className="text-sm text-zinc-400 font-normal">/ {maxMarks}</span></span>
        </div>
      </div>
    );
  }

  return null;
}
