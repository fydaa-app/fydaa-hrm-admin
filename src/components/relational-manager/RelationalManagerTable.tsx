// ==========================================
// FILE: components/relational-manager/RelationalManagerTable.tsx
// ==========================================

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteRelationalManager from "@/components/relational-manager/DeleteRelationalManager";
import EditRelationalManager from "@/components/relational-manager/EditRelationalManager";

export interface RelationalManagerTableProps {
  relationalManagers: {
    id: number;
    name: string;
    mobileNumber: string;
    email: string;
    description: string;
    age: number;
    experienceYears: number;
    photo?: string;
    attachment1?: string;
    attachment2?: string;
    isActive: boolean;
  }[];
  error: string | null;
  onUpdate?: () => void;
}

export interface RelationalManager {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  description: string;
  age: number;
  experienceYears: number;
  photo?: string;
  attachment1?: string;
  attachment2?: string;
  isActive: boolean;
}

export default function RelationalManagerTable({ 
  relationalManagers = [], 
  error, 
  onUpdate 
}: RelationalManagerTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRelationalManager, setSelectedRelationalManager] = useState<RelationalManager | null>(null);

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleCloseDelete = () => {
    setDeleteModalOpen(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/0.05 dark:bg-white/0.03">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1400px]">
          {error && (
            <div className="m-4">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}
          {!error && relationalManagers.length === 0 ? (
            <div className="m-4">
              <p>No relational managers found.</p>
            </div>
          ) : (
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/0.05">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Photo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Mobile
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Age
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Experience
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Attachments
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/0.05">
                {relationalManagers.map((relationalManager, index) => (
                  <TableRow key={index}>
                    {/* Photo */}
                    <TableCell className="px-4 py-3 text-start">
                      {relationalManager.photo ? (
                        <img
                          src={relationalManager.photo}
                          alt={relationalManager.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Photo</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {relationalManager.name}
                      </span>
                    </TableCell>

                    {/* Mobile */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.mobileNumber}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.email}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="max-w-xs truncate" title={relationalManager.description}>
                        {relationalManager.description}
                      </div>
                    </TableCell>

                    {/* Age */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.age}
                    </TableCell>

                    {/* Experience */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.experienceYears} {relationalManager.experienceYears === 1 ? 'year' : 'years'}
                    </TableCell>

                    {/* Attachments */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        {relationalManager.attachment1 && (
                          <a
                            href={relationalManager.attachment1}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            File 1
                          </a>
                        )}
                        {relationalManager.attachment2 && (
                          <a
                            href={relationalManager.attachment2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            File 2
                          </a>
                        )}
                        {!relationalManager.attachment1 && !relationalManager.attachment2 && (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          relationalManager.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {relationalManager.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRelationalManager(relationalManager);
                            setEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRelationalManager(relationalManager);
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedRelationalManager && (
        <>
          <EditRelationalManager
            isOpen={editModalOpen}
            onClose={handleCloseEdit}
            relationalManager={selectedRelationalManager}
          />
          <DeleteRelationalManager
            isOpen={deleteModalOpen}
            onClose={handleCloseDelete}
            relationalManagerId={selectedRelationalManager.id}
            relationalManagerName={selectedRelationalManager.name}
          />
        </>
      )}
    </div>
  );
}


