"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { hierarchyServiceApi } from "@/services/hierarchyServiceApi";

interface DeleteHierarchyProps {
  isOpen: boolean;
  onClose: () => void;
  hierarchyId: number;
  hierarchyName: string;
}

export default function DeleteHierarchy({ 
  isOpen, 
  onClose, 
  hierarchyId,
  hierarchyName 
}: DeleteHierarchyProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await hierarchyServiceApi.deleteHierarchy(hierarchyId);
      toast.success(`${hierarchyName} deleted successfully`);
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${hierarchyName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Confirm Deletion</h2>
          <p className="mb-6 dark:text-gray-300">
            Are you sure you want to delete <span className="font-bold">{hierarchyName}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-70"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}