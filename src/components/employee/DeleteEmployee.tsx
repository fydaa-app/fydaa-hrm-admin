"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { employeeServiceApi } from "@/services/employeeServiceApi";

interface DeleteEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  employeeName: string;
}

export default function DeleteEmployee({ isOpen, onClose, employeeId, employeeName }: DeleteEmployeeProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteEmployee = async () => {
    setIsLoading(true);
    try {
      await employeeServiceApi.deleteEmployee(employeeId);
      toast.success('Employee deleted successfully');
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Delete Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete employee <span className="font-semibold">{employeeName}</span>? 
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleDeleteEmployee}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400"
          >
            {isLoading ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}