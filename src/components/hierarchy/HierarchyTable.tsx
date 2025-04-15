// components/tables/TransactionTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface HierarchyTableProps {
  hierarchies: {
    hierarchyName: string;
    level: number;
  }[];
  error: string | null;
}

export default function HierarchyTable({ 
  hierarchies = [], 
  error 
}: HierarchyTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          {error && <div className="m-4"><p style={{ color: "red" }}>{error}</p></div>}
          {!error && hierarchies.length > 0 ? (
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Hierarchy Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Level
                  </TableCell>
                </TableRow>
              </TableHeader>
              
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {hierarchies.map((hierarchy, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {hierarchy.hierarchyName}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {hierarchy.level}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            !error && <div className="m-4">
              <p>No hierarchies found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}