import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { employeeServiceApi } from "@/services/employeeServiceApi";

interface Employee {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  level: string;
  managerName: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave";
}

interface ApiResponse {
  data: {
    employees: Employee[];
  };
}
export default function RecentEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentEmployees = async () => {
      try {
        setLoading(true);
        const response = await employeeServiceApi.getRecentEmployees();
        const responesData = response.data as ApiResponse
        setEmployees(responesData.data.employees);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEmployees();
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Employees
          </h3>
        </div>
        <p>Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Employees
          </h3>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Employees
          </h3>
        </div> 
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Employee
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contact
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Manager
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Join Date
              </TableCell>              
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {employees.map((employee) => (
              <TableRow key={employee.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                      <Image
                        width={50}
                        height={50}
                        src="/images/user/user-image.png"
                        className="h-[50px] w-[50px] object-cover"
                        alt={employee.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {employee.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        Level {employee.level}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                    {employee.email}
                  </p>
                  <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                    +91 {employee.mobileNumber}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {employee.role}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {employee.managerName || 'N/A'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(employee.joinDate)}
                </TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}