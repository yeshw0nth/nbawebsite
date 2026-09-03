"use client";

import React, { useMemo, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { hierarchy, tree } from "d3-hierarchy";
import guidelinesData from "@/data/guidelines.json";
import { useRouter } from "next/navigation";
import { useProgress } from "@/context/ProgressContext";
import { Maximize2, ZoomIn, ZoomOut, X } from "lucide-react";

type TreeNode = {
  id: string;
  name: string;
  type: "root" | "criterion" | "sub" | "subsub";
  children?: TreeNode[];
};

export default function TreeVisualizer() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { getNodeStatus } = useProgress();

  const data = useMemo(() => {
    const root: TreeNode = {
      id: "root",
      name: "SAR 1000 Marks",
      type: "root",
      children: guidelinesData.map(c => ({
        id: c.id,
        name: c.Criterion,
        type: "criterion",
        children: c["Sub-Criteria"].map(s => ({
          id: s.id,
          name: s.Title,
          type: "sub",
          children: s["Sub-Sub-Criteria"]?.map(ss => ({
            id: ss.id,
            name: ss.Title,
            type: "subsub"
          })) || []
        }))
      }))
    };
    return root;
  }, []);

  const { nodes, links } = useMemo(() => {
    const rootNode = hierarchy(data);
    const treeLayout = tree<TreeNode>().nodeSize([40, 250]);
    const treeData = treeLayout(rootNode);

    return {
      nodes: treeData.descendants(),
      links: treeData.links()
    };
  }, [data]);

  const getMinMaxY = () => {
    let min = Infinity;
    let max = -Infinity;
    nodes.forEach(n => {
      if (n.x < min) min = n.x;
      if (n.x > max) max = n.x;
    });
    return { min, max };
  };
  const { min, max } = getMinMaxY();
  const svgHeight = Math.max(800, max - min + 100);

  return (
    <div className={`relative group ${
      isFullscreen 
        ? "fixed inset-0 z-[100] bg-surface p-8 w-screen h-screen" 
        : "w-full h-[calc(100vh-120px)] bg-surface-alt rounded-xl border border-border overflow-hidden shadow-inner"
    }`}>
      {isFullscreen && (
        <button 
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-6 z-[110] p-2 bg-surface border border-border rounded-full shadow-md text-muted hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      )}
      
      <TransformWrapper
        initialScale={0.8}
        minScale={0.1}
        maxScale={2}
        centerOnInit={true}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className={`absolute ${isFullscreen ? "top-6 right-20" : "top-4 right-4"} flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <button onClick={() => zoomIn()} className="p-2 bg-surface border border-border rounded-md shadow-sm text-muted hover:text-foreground"><ZoomIn size={16} /></button>
              <button onClick={() => zoomOut()} className="p-2 bg-surface border border-border rounded-md shadow-sm text-muted hover:text-foreground"><ZoomOut size={16} /></button>
              <button onClick={() => resetTransform()} className="p-2 bg-surface border border-border rounded-md shadow-sm text-muted hover:text-foreground" title="Reset View"><Maximize2 size={16} /></button>
              {!isFullscreen && (
                <button onClick={() => setIsFullscreen(true)} className="p-2 bg-surface border border-border rounded-md shadow-sm text-accent hover:text-accent-hover ml-2 font-medium text-xs">
                  Expand View
                </button>
              )}
            </div>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
              <svg width="2500" height={svgHeight} style={{ overflow: "visible" }} className="mx-auto my-auto cursor-grab active:cursor-grabbing">
                <g transform={`translate(100, ${Math.abs(min) + 50})`}>
                  {links.map((link, i) => (
                    <path
                      key={i}
                      d={`M${link.source.y},${link.source.x} 
                          C${(link.source.y + link.target.y) / 2},${link.source.x} 
                           ${(link.source.y + link.target.y) / 2},${link.target.x} 
                           ${link.target.y},${link.target.x}`}
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth={2}
                      className="opacity-50"
                    />
                  ))}
                  {nodes.map((node, i) => {
                    const status = getNodeStatus(node.data.id);
                    const isRoot = node.data.type === "root";
                    const isSubSub = node.data.type === "subsub";
                    
                    let fillColor = "var(--color-muted)";
                    if (isRoot) fillColor = "var(--color-foreground)";
                    else if (status === "completed") fillColor = "#059669";
                    else if (status === "ongoing") fillColor = "var(--color-accent)";

                    return (
                      <g key={i} transform={`translate(${node.y},${node.x})`}>
                        <circle
                          r={isRoot ? 8 : node.data.type === "criterion" ? 6 : 4}
                          fill={fillColor}
                          className={isSubSub ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
                          onClick={() => {
                            if (isSubSub || node.data.type === "sub" || node.data.type === "criterion") {
                              router.push(`/criteria/${node.data.id}`);
                            }
                          }}
                        />
                        <text
                          dy=".31em"
                          x={node.children ? -12 : 12}
                          textAnchor={node.children ? "end" : "start"}
                          className={`text-xs select-none ${
                            isSubSub ? "fill-muted hover:fill-accent cursor-pointer font-medium transition-colors" : "fill-foreground font-semibold"
                          }`}
                          onClick={() => {
                            if (isSubSub || node.data.type === "sub" || node.data.type === "criterion") {
                              router.push(`/criteria/${node.data.id}`);
                            }
                          }}
                        >
                          {node.data.name.length > 40 ? node.data.name.substring(0, 40) + "..." : node.data.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
