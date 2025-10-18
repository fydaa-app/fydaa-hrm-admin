import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteRelationalManager from '@/components/relational-manager/DeleteRelationalManager';
import EditRelationalManager from "@/components/relational-manager/EditRelationalManager";

export interface RelationalManagerTableProps {
  relationalManagers: {
    id: number;
    name: string;
    mobileNumber: string;
    email: string;
    type: 'employee' | 'company_appointee';
    employeeId?: number;
    appointeeName?: string;
    profilePicture?: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    employee?: {
      id: number;
      name: string;
      email: string;
    };
  }[];
  error: string | null;
}

export interface RelationalManager {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  type: 'employee' | 'company_appointee';
  employeeId?: number;
  appointeeName?: string;
  profilePicture?: string;
  description?: string;
  isActive: boolean;
  employee?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function RelationalManagerTable({ 
  relationalManagers = [], 
  error 
}: RelationalManagerTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRelationalManager, setSelectedRelationalManager] = useState<RelationalManager | null>(null);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1400px]">
          {error && <div className="m-4"><p style={{ color: "red" }}>{error}</p></div>}
          {!error && relationalManagers.length > 0 ? (
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Join Date
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Mobile Number
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Type
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Employee/Appointee
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Description
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {relationalManagers.map((relationalManager, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(relationalManager.createdAt)}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        {relationalManager.profilePicture && (
                          <img 
                            src={relationalManager.profilePicture} 
                            alt={relationalManager.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {relationalManager.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.mobileNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <span className="capitalize">
                        {relationalManager.type === 'employee' ? 'Employee' : 'Company Appointee'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.type === 'employee' && relationalManager.employee ? (
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {relationalManager.employee.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {relationalManager.employee.email}
                          </div>
                        </div>
                      ) : relationalManager.type === 'company_appointee' && relationalManager.appointeeName ? (
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {relationalManager.appointeeName}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {relationalManager.description ? (
                        <div className="max-w-xs truncate" title={relationalManager.description}>
                          {relationalManager.description}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        relationalManager.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {relationalManager.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>     
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
          ) : (
            !error && <div className="m-4">
              <p>No relational managers found.</p>
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
      {selectedRelationalManager && (
        <>
          <EditRelationalManager
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            relationalManager={selectedRelationalManager}
          />
          
          <DeleteRelationalManager
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            relationalManagerId={selectedRelationalManager.id}
            relationalManagerName={selectedRelationalManager.name}
          />
        </>
      )}
    </div>
  );
}
