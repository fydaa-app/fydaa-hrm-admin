"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Label from "@/components/form/Label";
import { hierarchyServiceApi } from "@/services/hierarchyServiceApi";
interface CreateHierarchyProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HierarchyData {
  hierarchyName: string;
  level: number;
}

const DEFAULT_HIERARCHY_DATA: HierarchyData = {
  hierarchyName: "",
  level: 0
};

export default function CreateHierarchy({ isOpen, onClose }: CreateHierarchyProps) {
  const router = useRouter();
  const [hierarchyData, setHierarchyData] = useState<HierarchyData>(DEFAULT_HIERARCHY_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!hierarchyData.hierarchyName) newErrors.hierarchyName = 'Hierarchy name is required';
    if (!hierarchyData.level || hierarchyData.level <= 0) newErrors.level = 'Level must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateHierarchy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await hierarchyServiceApi.createHierarchy(hierarchyData);
      toast.success('Hierarchy created successfully');
      router.refresh();
      closeModal();
    } catch (error) {

        const errorData = error as { 
            error: {
            message: string;
            }
        };
        
      closeModal();
      toast.error(errorData.error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setHierarchyData(DEFAULT_HIERARCHY_DATA);
    setErrors({});
    onClose();
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert empty string to 0, otherwise parse the number
    const numericValue = value === '' ? 0 : Number(value);
    setHierarchyData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHierarchyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Create New Hierarchy</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleCreateHierarchy} className="p-4 space-y-4">
          <div>
            <Label htmlFor="hierarchyName">Hierarchy Name *</Label>
            <Input
              id="hierarchyName"
              name="hierarchyName"
              value={hierarchyData.hierarchyName}
              onChange={handleTextChange}
              error={!!errors.hierarchyName}
            />
            {errors.hierarchyName && <p className="text-red-500 text-sm mt-1">{errors.hierarchyName}</p>}
          </div>

          <div>
            <Label htmlFor="level">Level *</Label>
            <Input
              id="level"
              name="level"
              type="number"
              min="1"
              value={hierarchyData.level || ''}
              onChange={handleNumberChange}
              error={!!errors.level}
            />
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Creating...' : 'Create Hierarchy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}