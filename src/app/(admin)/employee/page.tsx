"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmployeeTable from "@/components/employee/EmployeeTable";
// import { Metadata } from "next";
import React ,  { useState } from "react";
import CreateEmployee from '@/components/employee/CreateEmployee';
// export const metadata: Metadata = {
//   title: "Employee | Fydaa",
//   description:
//     "Fydaa",
//   // other metadata
// };

export default function EmployeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <PageBreadcrumb pageTitle="Employee" />
      <div className="space-y-6">
        <ComponentCard title="Employee List">
        <div className="flex justify-self-end">
          <button onClick={() => setIsModalOpen(true)}         
            className="w-auto inline-flex bg-brand-500 text-white hover:bg-brand-600 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 px-4 py-2 
            rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
            Create New Employee
          </button>
        </div>

          <CreateEmployee
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <EmployeeTable />
        </ComponentCard>
      </div>
    </div>
  );
}
