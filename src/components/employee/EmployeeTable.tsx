import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteEmployee from '@/components/employee/DeleteEmployee';
import EditEmployee from "@/components/employee/EditEmployee";

export interface EmployeeTableProps {
  employees: {
    id: number;
    name: string;
    mobileNumber: string;
    email:string;
    role:string;
    managerName:string;
    level: number;
    managerId?: number;
    joinDate:string;
    referralCode?: string;
    isActive: boolean;
    monthlyTarget?: number;
    quarterlyTarget?: number;
    annualTarget?: number;
  }[];
  error: string | null;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  level: number;
  role: string;
  managerId?: number;
  managerName:string;
  isActive: boolean; // Add isActive field
}

export default function EmployeeTable({ 
  employees = [], 
  error 
}: EmployeeTableProps) {
   const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]"> {/* Increased min-width to accommodate new column */}
          {error && <div className="m-4"><p style={{ color: "red" }}>{error}</p></div>}
          {!error && employees.length > 0 ? (
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
                    Role
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Manager Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Referral Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Monthly Target
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Quarterly Target
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Annual Target
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {employees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDate(employee.joinDate)}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {employee.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.mobileNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.managerName}
                    </TableCell>         
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.referralCode}
                    </TableCell>      
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.monthlyTarget ? `₹${employee.monthlyTarget.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.quarterlyTarget ? `₹${employee.quarterlyTarget.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employee.annualTarget ? `₹${employee.annualTarget.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
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
              <p>No employees found.</p>
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
        {selectedEmployee && (
          <>
            <EditEmployee
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              employee={selectedEmployee}
            />
            
            <DeleteEmployee
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              employeeId={selectedEmployee.id}
              employeeName={selectedEmployee.name}
            />
          </>
        )}
    </div>
  );
}