"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EmployeeDetails, employeeServiceApi } from "@/services/employeeServiceApi";
import axios from "axios";

interface DeactivateEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeDetails;
}


interface Manager {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  role: string;
  level: string;
}

export default function DeactivateEmployee({
  isOpen,
  onClose,
  employee,
}: DeactivateEmployeeProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [replacementId, setReplacementId] = useState<number | null>(null);
  const [replacementEmployeeReferralCode, setReplacementEmployeeReferralCode] = useState<string>("");
  const [allEmployees, setAllEmployees] = useState<Manager[]>([]);
  const [results, setResults] = useState<Manager[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch all employees from employee-list API once on open
  const fetchAllEmployees = useCallback(async () => {
    try { 
      setIsLoading(true);
      const response = await axios.get(
        "https://crm-prod.fydaa.com/referrals/employee-list?limit=100"
      );
      const employees: Manager[] = response.data?.data?.employees ?? [];
      // Exclude the employee being deactivated
      const filtered = employees.filter((e) => e.id !== employee.id);
      setAllEmployees(filtered);
      setResults(filtered);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  }, [employee.id]);

  useEffect(() => {
    if (isOpen) {
      fetchAllEmployees();
      setSearchQuery("");
      setReplacementId(null);
      setReplacementEmployeeReferralCode("");
      setError("");
    }
  }, [isOpen, fetchAllEmployees]);

  // ✅ Client-side filtering — no extra API calls on search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setReplacementId(null);
    setReplacementEmployeeReferralCode("");
    setShowDropdown(true);

    if (!query.trim()) {
      setResults(allEmployees);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = allEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.referralCode.toLowerCase().includes(lower)
    );
    setResults(filtered);
  };

  const handleSelect = (emp: Manager) => {
    setReplacementId(emp.id);
    setReplacementEmployeeReferralCode(emp.referralCode); // ✅ Store referral code
    setSearchQuery(`${emp.name} (${emp.email}) — ${emp.referralCode}`); // ✅ Show in input
    setShowDropdown(false);
    setError("");
  };

  const handleSubmit = async () => {
    if (!replacementId || !replacementEmployeeReferralCode) {
      setError("Please select a replacement employee");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await employeeServiceApi.deactivateAndReassign(
              employee.id,
              replacementId,
              replacementEmployeeReferralCode  
            );
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Employee deactivated and users reassigned successfully");
        router.refresh();
        onClose();
      } else {
        toast.error("Failed to deactivate employee");
      }
    } catch {
      toast.error("Failed to deactivate employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-red-600">
            Deactivate Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 dark:bg-yellow-900/20 dark:border-yellow-700">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Deactivating <strong>{employee.name}</strong> will reassign all
              their users and relationship manager to the selected employee.
            </p>
          </div>

          {/* Replacement Employee Search */}
          <div>
            <Label htmlFor="replacement">
              Select Replacement Employee *
            </Label>
            <div className="relative">
              <Input
                id="replacement"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search by name, email or referral code..."
                error={!!error}
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                </div>
              )}
              {showDropdown && !isLoading && results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                  {results.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                      onClick={() => handleSelect(emp)}
                    >
                      {/* ✅ Name + email */}
                      <span className="font-medium">{emp.name}</span>{" "}
                      <span className="text-gray-400 text-xs">({emp.email})</span>
                      {/* ✅ Referral code on second line */}
                      <span className="block text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                        Code: {emp.referralCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {showDropdown && !isLoading && results.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
                  No employees found
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting || !replacementId}
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Deactivating..." : "Deactivate & Reassign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}