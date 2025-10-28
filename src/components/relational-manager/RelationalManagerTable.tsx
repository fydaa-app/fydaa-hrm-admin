import React, { useState, useEffect, useRef } from "react";
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
    photo?: string;
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
  onUpdate?: () => void;
}



export interface RelationalManager {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  type: 'employee' | 'company_appointee';
  employeeId?: number;
  appointeeName?: string;
  photo?: string;
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
  error,
  onUpdate
}: RelationalManagerTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRelationalManager, setSelectedRelationalManager] = useState<RelationalManager | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  
  // ✅ Use ref instead of state to avoid re-renders
  const overflowCheckRef = useRef<Set<number>>(new Set());
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const toggleDescription = (managerId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(managerId)) {
        newSet.delete(managerId);
      } else {
        newSet.add(managerId);
      }
      return newSet;
    });
  };


  // ✅ Use IntersectionObserver instead of setTimeout
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const id = element.dataset.managerId;
            if (id && element.scrollWidth > element.offsetWidth) {
              overflowCheckRef.current.add(Number(id));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-description-cell]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [relationalManagers]);



  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {error && <div className="m-4"><p style={{ color: "red" }}>{error}</p></div>}
        {!error && relationalManagers.length > 0 ? (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[110px]">
                  Join Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[180px]">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[130px]">
                  Mobile Number
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[200px]">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[150px]">
                  Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[180px]">
                  Employee/Appointee
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[200px]">
                  Description
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[100px]">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[120px] sticky right-0 bg-white dark:bg-white/[0.03]">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
              
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {relationalManagers.map((relationalManager) => {
                const isExpanded = expandedDescriptions.has(relationalManager.id);
                const hasDescription = relationalManager.description && relationalManager.description.length > 50;
                return (<TableRow key={relationalManager.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[110px]">
                    {formatDate(relationalManager.createdAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start min-w-[180px]">
                    <div className="flex items-center gap-3">
                      {relationalManager.photo && (
                        <img 
                          src={relationalManager.photo} 
                          alt={relationalManager.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                          {relationalManager.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[130px]">
                    {relationalManager.mobileNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">
                    <div className="truncate">{relationalManager.email}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[150px]">
                    <span className="capitalize whitespace-nowrap">
                      {relationalManager.type === 'employee' ? 'Employee' : 'Company Appointee'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[180px]">
                    {relationalManager.type === 'employee' && relationalManager.employee ? (
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 dark:text-white/90 truncate">
                          {relationalManager.employee.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {relationalManager.employee.email}
                        </div>
                      </div>
                    ) : relationalManager.type === 'company_appointee' && relationalManager.appointeeName ? (
                      <div className="font-medium text-gray-800 dark:text-white/90 truncate">
                        {relationalManager.appointeeName}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">
                    {relationalManager.description ? (
                      <div className="max-w-[200px]">
                        <div 
                          data-description-cell
                          data-manager-id={relationalManager.id}
                          className={isExpanded ? 'whitespace-normal break-words' : 'truncate'}
                        >
                          {relationalManager.description}
                        </div>
                        {hasDescription && (
                          <button
                            className="text-blue-600 hover:underline text-xs mt-1 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(relationalManager.id);
                            }}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm w-[100px]">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      relationalManager.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {relationalManager.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px] sticky right-0 bg-white dark:bg-white/[0.03]">
                    <div className="flex space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRelationalManager(relationalManager);
                          setEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRelationalManager(relationalManager);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>);
              })}
            </TableBody>
          </Table>
        ) : (
          !error && <div className="m-4">
            <p>No relational managers found.</p>
          </div>
        )}
      </div>
      {/* Modals */}
      {selectedRelationalManager && (
        <>
          <EditRelationalManager
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              if (onUpdate) onUpdate();
            }}
            relationalManager={selectedRelationalManager}
          />
          
          <DeleteRelationalManager
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              if (onUpdate) onUpdate();
            }}
            relationalManagerId={selectedRelationalManager.id}
            relationalManagerName={selectedRelationalManager.name}
          />
        </>
      )}
    </div>
  );
}
