"use client";
import React, { useEffect, useState } from "react";
import { ExportIcon, SalesIcon, OrderIcon, DiscIcon } from "@/icons";
import { employeeServiceApi } from "@/services/employeeServiceApi";

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
}

export const TodaySale = () => {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        setLoading(true);
        const respones = await employeeServiceApi.getEmployeeStats();
        const responesData = respones.data as 
        { data: {
          totalEmployees: number;
          activeEmployees: number;
          inactiveEmployees: number;
        }};       
        setStats(responesData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] h-full flex justify-center items-center">
        <p>Loading employee statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] h-full flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] h-full flex justify-between flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Employee Summary
            </h3>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <ExportIcon /> Export
          </button>
        </div>

        <div className="flex items-end justify-between mt-5 sales-box-row">
          <div className="col-span-4">
            <div className="box-total-sales">
              <SalesIcon />
              <h2 className="numbers-sale">{stats?.totalEmployees ?? 'N/A'}</h2>
              <p className="total-sale-text">Total Employee</p>
            </div>
          </div>
          <div className="col-span-4">
            <div className="box-total-sales">
              <OrderIcon />
              <h2 className="numbers-sale">{stats?.activeEmployees ?? 'N/A'}</h2>
              <p className="total-sale-text">Total Active Employee</p>
            </div>
          </div>
          <div className="col-span-4">
            <div className="box-total-sales">
              <DiscIcon />
              <h2 className="numbers-sale">{stats?.inactiveEmployees ?? 'N/A'}</h2>
              <p className="total-sale-text">Total Inactive Employee</p>
            </div>
          </div>
          <div className="col-span-4">
            <div className="box-total-sales">
              <SalesIcon />
              <h2 className="numbers-sale">0</h2>
              <p className="total-sale-text">Asset Under Advisory</p>
            </div>
          </div>
        </div>       
      </div> 
    </div>
  );
};