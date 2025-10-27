"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Label from "@/components/form/Label";
import { hierarchyServiceApi } from "@/services/hierarchyServiceApi";

interface EditHierarchyProps {
  isOpen: boolean;
  onClose: () => void;
  hierarchy: {
    id: number;
    hierarchyName: string;
    level: number;
    target: number;
    totalUsers: number;
    totalRevenue: number;
  };
}

export default function EditHierarchy({ isOpen, onClose, hierarchy }: EditHierarchyProps) {
  const router = useRouter();
  const [hierarchyData, setHierarchyData] = useState(hierarchy);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHierarchyData(hierarchy);
    }
  }, [isOpen, hierarchy]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!hierarchyData.hierarchyName) newErrors.hierarchyName = 'Hierarchy name is required';
    if (!hierarchyData.level || hierarchyData.level <= 0) newErrors.level = 'Level must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateHierarchy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await hierarchyServiceApi.updateHierarchy(hierarchyData.id, hierarchyData);
      
      // Check for successful response (200 or 201)
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Hierarchy updated successfully');
        router.refresh();
        onClose();
      } else {
        toast.error('Failed to update hierarchy');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update hierarchy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHierarchyData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
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
          <h2 className="text-xl font-semibold dark:text-white">Edit Hierarchy</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdateHierarchy} className="p-4 space-y-4">
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
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Updating...' : 'Update Hierarchy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}