"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Label from "@/components/form/Label";
import { 
    UpdateRelationalManagerRequest,
    RelationalManagerDetails,
    relationalManagerServiceApi
} from "@/services/relationalManagerServiceApi";

interface UpdateRelationalManagerProps {
  isOpen: boolean;
  onClose: () => void;
  relationalManager: RelationalManagerDetails;
}

interface Employee {
  id: number;
  name: string;
  email: string;
}

export default function UpdateRelationalManager({ isOpen, onClose, relationalManager }: UpdateRelationalManagerProps) {
  const router = useRouter();
  const [relationalManagerMetadata, setRelationalManagerMetadata] = useState<UpdateRelationalManagerRequest>({
    id: relationalManager.id,
    name: relationalManager.name,
    mobileNumber: relationalManager.mobileNumber,
    email: relationalManager.email,
    type: relationalManager.type || "employee",
    employeeId: relationalManager.employeeId,
    isActive: relationalManager.isActive ?? true
  });
  const [employeeResults, setEmployeeResults] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState(relationalManager.employee?.name || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  
  const fetchEmployees = useCallback(async (query?: string) => {
    try {
      setIsLoadingEmployees(true);
      const response = await relationalManagerServiceApi.searchEmployees({ search: query || "" });
      const responseData = response.data as { data: Employee[] };
      setEmployeeResults(responseData.data);
      
      if (!query && relationalManager.employeeId && relationalManager.employee) {
        const employee = responseData.data.find(e => e.id === relationalManager.employeeId);
        if (employee) {
          setSearchQuery(employee.name);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch employees');
      setEmployeeResults([]);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [relationalManager.employeeId, relationalManager.employee]);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, fetchEmployees]);

  useEffect(() => {
    if (isOpen && relationalManager) {
      setRelationalManagerMetadata({
        id: relationalManager.id,
        name: relationalManager.name,
        mobileNumber: relationalManager.mobileNumber,
        email: relationalManager.email,
        type: relationalManager.type || "employee",
        employeeId: relationalManager.employeeId,
        isActive: relationalManager.isActive ?? true
      });
      setSearchQuery(relationalManager.employee?.name || "");
      setShowDropdown(false);
    }
  }, [isOpen, relationalManager]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!relationalManagerMetadata.name) newErrors.name = 'Name is required';
    if (!relationalManagerMetadata.email) newErrors.email = 'Email is required';
    if (!relationalManagerMetadata.mobileNumber) newErrors.phone = 'Phone is required';
    if (!relationalManagerMetadata.employeeId) newErrors.employee = 'Employee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateRelationalManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingButton(true);
    try {
      await relationalManagerServiceApi.updateRelationalManager(relationalManagerMetadata.id, relationalManagerMetadata);     
      toast.success('Relational Manager updated successfully');
      router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);  
      toast.error('Failed to update relational manager');
    } finally {
      setIsLoadingButton(false);
    }
  };

  const closeModal = () => {
    setSearchQuery("");
    setEmployeeResults([]);
    setShowDropdown(false);
    setErrors({});
    onClose();
  };

  const handleEmployeeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (relationalManagerMetadata.employeeId) {
      setRelationalManagerMetadata(prev => ({
        ...prev,
        employeeId: undefined
      }));
    }
    
    setShowDropdown(true);
    
    const timeoutId = setTimeout(() => {
      fetchEmployees(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setRelationalManagerMetadata(prev => ({
      ...prev,
      employeeId: employee.id
    }));
    setSearchQuery(employee.name);
    setShowDropdown(false);
    setEmployeeResults([]);
    
    if (errors.employee) {
      setErrors(prev => ({
        ...prev,
        employee: ''
      }));
    }
  };

  const handleInputFocus = () => {
    if (employeeResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Update Relational Manager</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdateRelationalManager} className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={relationalManagerMetadata.name}
              onChange={(e) => setRelationalManagerMetadata(prev => ({
                ...prev,
                name: e.target.value
              }))}
              error={!!errors.name}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={relationalManagerMetadata.email}
              onChange={(e) => setRelationalManagerMetadata(prev => ({
                ...prev,
                email: e.target.value
              }))}
              error={!!errors.email}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={relationalManagerMetadata.mobileNumber}
              onChange={(e) => setRelationalManagerMetadata(prev => ({
                ...prev,
                mobileNumber: e.target.value
              }))}
              error={!!errors.phone}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}           
          </div>

          <div>
            <Label htmlFor="employee">Employee *</Label>
            <div className="relative">
              <Input
                id="employee"
                value={searchQuery}
                onChange={handleEmployeeSearch}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search employees..."
                error={!!errors.employee}
              />
              {isLoadingEmployees && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
              
              {showDropdown && !isLoadingEmployees && employeeResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                  {employeeResults.map(employee => (
                    <button
                      key={employee.id}
                      type="button"
                      className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      {employee.name} ({employee.email})
                    </button>
                  ))}
                </div>
              )}
              
              {showDropdown && !isLoadingEmployees && employeeResults.length === 0 && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  No employees found
                </div>
              )}
            </div>
            {errors.employee && <p className="text-red-500 text-sm mt-1">{errors.employee}</p>}
          </div>

          <div>
            <Label htmlFor="isActive">Status</Label>
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={() => setRelationalManagerMetadata(prev => ({
                  ...prev,
                  isActive: !prev.isActive
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  relationalManagerMetadata.isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    relationalManagerMetadata.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {relationalManagerMetadata.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
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
              disabled={isLoadingButton}
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isLoadingButton ? 'Updating...' : 'Update Relational Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
