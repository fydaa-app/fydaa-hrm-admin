import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteAdvisor from '@/components/advisor/DeleteAdvisor';
import EditAdvisor from "@/components/advisor/EditAdvisor";



export interface AdvisorTableProps {
  advisors: {
    id: number;
    name: string;
    mobile: string;
    email: string;
    description: string;
    age: number;
    experienceInYears: number;
    photo: string;
    attachment1?: string;
    attachment2?: string;
    isActive: boolean;
  }[];
  error: string | null;
  onUpdate?: () => void;
}



export interface Advisor {
  id: number;
  name: string;
  mobile: string;
  email: string;
  description: string;
  age: number;
  experienceInYears: number;
  photo: string;
  attachment1?: string;
  attachment2?: string;
  isActive: boolean;
}



export default function AdvisorTable({ 
  advisors = [], 
  error,
  onUpdate
}: AdvisorTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  
  // Use ref instead of state to avoid re-renders
  const overflowCheckRef = useRef<Set<number>>(new Set());

  const toggleDescription = (advisorId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(advisorId)) {
        newSet.delete(advisorId);
      } else {
        newSet.add(advisorId);
      }
      return newSet;
    });
  };

  // Use IntersectionObserver for efficient overflow detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const id = element.dataset.advisorId;
            if (id && element.scrollWidth > element.offsetWidth) {
              overflowCheckRef.current.add(Number(id));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all description elements
    const elements = document.querySelectorAll('[data-description-cell]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [advisors]);

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    if (onUpdate) onUpdate();
  };

  const handleCloseDelete = () => {
    setDeleteModalOpen(false);
    if (onUpdate) onUpdate();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {error && <div className="m-4"><p style={{ color: "red" }}>{error}</p></div>}
        {!error && advisors.length > 0 ? (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[80px]">
                  Photo
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[150px]">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[120px]">
                  Mobile
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[200px]">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[200px]">
                  Description
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[70px]">
                  Age
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[110px]">
                  Experience
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[120px]">
                  Attachments
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
              {advisors.map((advisor) => {
                // Compute these once per row
                const isExpanded = expandedDescriptions.has(advisor.id);
                const hasDescription = advisor.description && advisor.description.length > 50;
                
                return (
                  <TableRow key={advisor.id}>
                    {/* Photo */}
                    <TableCell className="px-4 py-3 text-start w-[80px]">
                      {advisor.photo ? (
                        <img 
                          src={advisor.photo} 
                          alt={advisor.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 text-xs">No Photo</span>
                        </div>
                      )}
                    </TableCell>
                    
                    {/* Name */}
                    <TableCell className="px-5 py-4 text-start min-w-[150px]">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                        {advisor.name}
                      </span>
                    </TableCell>
                    
                    {/* Mobile */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px]">
                      <div className="whitespace-nowrap">{advisor.mobile}</div>
                    </TableCell>
                    
                    {/* Email */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">
                      <div className="truncate">{advisor.email}</div>
                    </TableCell>
                    
                    {/* Optimized Description */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">
                      <div className="max-w-[200px]">
                        <div 
                          data-description-cell
                          data-advisor-id={advisor.id}
                          className={isExpanded ? 'whitespace-normal break-words' : 'truncate'}
                        >
                          {advisor.description}
                        </div>
                        {hasDescription && (
                          <button
                            className="text-blue-600 hover:underline text-xs mt-1 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(advisor.id);
                            }}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    </TableCell>

                    {/* Age */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[70px]">
                      {advisor.age}
                    </TableCell>
                    
                    {/* Experience */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[110px]">
                      <div className="whitespace-nowrap">{advisor.experienceInYears} {advisor.experienceInYears === 1 ? 'year' : 'years'}</div>
                    </TableCell>
                    
                    {/* Attachments */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px]">
                      <div className="flex flex-col gap-1">
                        {advisor.attachment1 && (
                          <a 
                            href={advisor.attachment1} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs whitespace-nowrap"
                          >
                            File 1
                          </a>
                        )}
                        {advisor.attachment2 && (
                          <a 
                            href={advisor.attachment2} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs whitespace-nowrap"
                          >
                            File 2
                          </a>
                        )}
                        {!advisor.attachment1 && !advisor.attachment2 && (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm w-[100px]">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        advisor.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {advisor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px] sticky right-0 bg-white dark:bg-white/[0.03]">
                      <div className="flex space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedAdvisor(advisor);
                            setEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAdvisor(advisor);
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          !error && <div className="m-4">
            <p>No advisors found.</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {selectedAdvisor && (
        <>
          <EditAdvisor
            isOpen={editModalOpen}
            onClose={handleCloseEdit}
            advisor={selectedAdvisor}
          />
          
          <DeleteAdvisor
            isOpen={deleteModalOpen}
            onClose={handleCloseDelete}
            advisorId={selectedAdvisor.id}
            advisorName={selectedAdvisor.name}
          />
        </>
      )}
    </div>
  );
}
