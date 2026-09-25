"use client";

import React from "react";
import { DataSheetGrid, DataSheetGridProps } from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";

export default function SpreadsheetGrid(props: DataSheetGridProps<any>) {
  return (
    <div className="spreadsheet-grid-wrapper overflow-hidden rounded-md border border-border">
      <DataSheetGrid {...props} />
      <style dangerouslySetInnerHTML={{__html: `
        .spreadsheet-grid-wrapper .dsg-container {
          --dsg-border-color: var(--color-border);
          --dsg-cell-background-color: var(--color-card);
          --dsg-header-text-color: var(--color-muted);
          --dsg-selection-border-color: var(--color-accent);
          --dsg-row-background-color: var(--color-card);
          --dsg-scroll-shadow-color: transparent;
          --dsg-font-family: inherit;
        }
        .spreadsheet-grid-wrapper .dsg-row {
          color: var(--color-foreground);
        }
        .spreadsheet-grid-wrapper .dsg-cell {
          background-color: var(--color-card);
        }
        .spreadsheet-grid-wrapper .dsg-cell-header {
          background-color: var(--color-surface-alt);
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--color-muted);
        }
        .spreadsheet-grid-wrapper .dsg-scrollable-view-t.dsg-scrollable-view-b {
          box-shadow: none !important;
        }
        .spreadsheet-grid-wrapper .dsg-scrollable-view-l,
        .spreadsheet-grid-wrapper .dsg-scrollable-view-r,
        .spreadsheet-grid-wrapper .dsg-scrollable-view-t,
        .spreadsheet-grid-wrapper .dsg-scrollable-view-b {
          box-shadow: none !important;
        }
      `}} />
    </div>
  );
}
