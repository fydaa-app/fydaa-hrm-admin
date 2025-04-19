"use client";
import React, { useState, useEffect } from "react";
import { storageService } from "@/helpers/storage";

interface EmployeeData {
  name: string;
  email: string;
  mobileNumber:string;
}

interface AuthResult {
  message: string;
  token: string;
  hr: {
    id: number;
    name: string;
    email: string;
    mobileNumber:string;
  };
}

export default function UserInfoCard() {
  
const [employeeData, setEmployeeData] = useState<EmployeeData>({
  name: "",
  email: "",
  mobileNumber:""
});

useEffect(() => {
    const result = storageService.get<AuthResult>('session');
    if (result && result.hr) {
      setEmployeeData({
        name: result.hr.name,
        email: result.hr.email,
        mobileNumber:result.hr.mobileNumber
      });
    }
  }, []);
  
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {employeeData.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {employeeData.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {employeeData.mobileNumber}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Hr
              </p>
            </div>
          </div>
        </div>       
      </div>

    </div>
  );
}
