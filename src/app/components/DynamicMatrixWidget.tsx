"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

interface DynamicMatrixWidgetProps {
  title: string;
  initialData: any[];
  columns: ColumnDef<any, any>[];
  onAddRow?: () => void;
  guidelineId?: string;
  tableId?: string;
}

export function DynamicMatrixWidget({
  title,
  initialData,
  columns,
  onAddRow,
  guidelineId,
  tableId = title
}: DynamicMatrixWidgetProps) {
  const { tableData, updateTableData } = useProgress();
  const contextData = (guidelineId && tableData[guidelineId]?.[tableId]) || initialData;
  const [data, setData] = useState(() => contextData);

  useEffect(() => {
    if (guidelineId) {
      updateTableData(guidelineId, tableId, data);
    }
  }, [data, guidelineId, tableId]);

  useEffect(() => {
    if (guidelineId && tableData[guidelineId]?.[tableId]) {
      setData(tableData[guidelineId][tableId]);
    }
  }, [tableData, guidelineId, tableId]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old: any[]) =>
          old.map((row: any, index: number) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 mt-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground">{title}</h3>
        {onAddRow && (
          <button
            onClick={onAddRow}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add Row
          </button>
        )}
      </div>

      <div className="border border-border rounded-md bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-surface-alt/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 font-medium text-muted tracking-tight border-r border-border last:border-r-0 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-alt/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-0 py-0 border-r border-border last:border-r-0 text-foreground"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-muted"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const EditableMatrixCell = ({ getValue, row: { index }, column: { id }, table }: any) => {
  const initialValue = getValue() || "";
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);

  const onBlur = () => {
    // Strict data validation for matrix cells
    const validValues = ["1", "2", "3", "-"];
    if (value && !validValues.includes(value)) {
      setError(true);
      setValue(initialValue); // Revert to initial value on invalid input
      
      // Auto-remove error ring after 1s
      setTimeout(() => setError(false), 1000);
      return;
    }
    
    setError(false);
    if (value !== initialValue) {
      table.options.meta?.updateData(index, id, value);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value as string}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      className={`w-full h-full px-4 py-3 bg-transparent text-center focus:outline-none transition-all ${
        error ? "ring-2 ring-red-500 bg-red-50/10" : "focus:bg-surface-alt/50"
      }`}
    />
  );
};
