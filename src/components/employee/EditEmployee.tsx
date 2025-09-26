"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Label from "@/components/form/Label";
import { 
    UpdateEmployeeRequest,
    EmployeeDetails,
    employeeServiceApi
} from "@/services/employeeServiceApi";

interface UpdateEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeDetails;
}

interface Manager {
  id: number;
  name: string;
  email: string;
}

interface Hierarchy {
  level: number;
  hierarchyName: string;
}

export default function UpdateEmployee({ isOpen, onClose, employee }: UpdateEmployeeProps) {
  const router = useRouter();
  const [employeeMetadata, setEmployeeMetadata] = useState<UpdateEmployeeRequest>({
    id: employee.id,
    name: employee.name,
    mobileNumber: employee.mobileNumber,
    email: employee.email,
    managerId: employee.managerId || undefined,
    level: Number(employee.level),
    role: employee.role,
    isActive: employee.isActive ?? true // Add isActive field with fallback to true
  });
  const [hierarchies, setHierarchies] = useState<Hierarchy[]>([]);
  const [managerResults, setManagerResults] = useState<Manager[]>([]);
  const [searchQuery, setSearchQuery] = useState(employee.managerName || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  
  const fetchHierarchies = useCallback(async () => {
    try {
      const response = await employeeServiceApi.getHierarchies();
      const responseData = response.data as { 
        data: {
        level: number;
        hierarchyName: string;
      }[]
    };
      setHierarchies(responseData.data);
    } catch {
      toast.error('Failed to fetch hierarchies');
    }
  }, []);

  const fetchManagers = useCallback(async (level: number, query?: string) => {
    if (!level) return;
    
    try {
      setIsLoadingManagers(true);
      const response = await employeeServiceApi.searchManagers({ 
        level,
        ...(query && { search: query })
      });
      const responseData = response.data as Manager[]
      setManagerResults(responseData);
      
      // If employee has a manager and this is initial load, find and set it
      if (!query && employee.managerId && employee.managerName) {
        const manager = responseData.find(m => m.id === employee.managerId);
        if (manager) {
          setSearchQuery(manager.name);
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch managers');
      setManagerResults([]);
    } finally {
      setIsLoadingManagers(false);
    }
  }, [employee.managerId, employee.managerName]);

  useEffect(() => {
    if (isOpen) {
      fetchHierarchies();
      if (employee.level) {
        fetchManagers(Number(employee.level));
      }
    }
  }, [isOpen, fetchHierarchies, fetchManagers, employee.level]);

  useEffect(() => {
    if (isOpen && employee) {
      setEmployeeMetadata({
        id: employee.id,
        name: employee.name,
        mobileNumber: employee.mobileNumber,
        email: employee.email,
        managerId: employee.managerId || undefined,
        level: Number(employee.level),
        role: employee.role,
        isActive: employee.isActive ?? true // Add isActive field
      });
      setSearchQuery(employee.managerName || "");
      setShowDropdown(false);
    }
  }, [isOpen, employee]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!employeeMetadata.name) newErrors.name = 'Name is required';
    if (!employeeMetadata.email) newErrors.email = 'Email is required';
    if (!employeeMetadata.mobileNumber) newErrors.phone = 'Phone is required';
    // if (!employeeMetadata.level) newErrors.level = 'Level is required';
    // Only require manager if level > 0
    if (employeeMetadata.level > 0 && !employeeMetadata.managerId) {
      newErrors.manager = 'Manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingButton(true);
    try {
      await employeeServiceApi.updateEmployee(employeeMetadata.id, {
        ...employeeMetadata,
        role: String(employeeMetadata.level)
      });     
      toast.success('Employee updated successfully');
      router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);  
      toast.error('Failed to update employee');
    } finally {
      setIsLoadingButton(false);
    }
  };

  const closeModal = () => {
    setSearchQuery("");
    setManagerResults([]);
    setShowDropdown(false);
    setErrors({});
    onClose();
  };

  const handleLevelChange = (e: string) => {
    const level = Number(e);
    setEmployeeMetadata(prev => ({
      ...prev,
      level,
      managerId: level === 0 ? undefined : prev.managerId
    }));
    setSearchQuery("");
    setShowDropdown(false);
    
    // Fetch managers for the new level
    if (level > 0) {
      fetchManagers(level);
    } else {
      setManagerResults([]);
    }
  };

  const handleManagerSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!employeeMetadata.level) return;
    
    // Clear manager selection if search query changes
    if (employeeMetadata.managerId) {
      setEmployeeMetadata(prev => ({
        ...prev,
        managerId: undefined
      }));
    }
    
    // Show dropdown when user types
    setShowDropdown(true);
    
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        fetchManagers(employeeMetadata.level, query);
      } else {
        fetchManagers(employeeMetadata.level);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const handleManagerSelect = (manager: Manager) => {
    setEmployeeMetadata(prev => ({
      ...prev,
      managerId: manager.id
    }));
    setSearchQuery(manager.name);
    setShowDropdown(false);
    setManagerResults([]);
    
    // Clear manager error if it exists
    if (errors.manager) {
      setErrors(prev => ({
        ...prev,
        manager: ''
      }));
    }
  };

  const handleInputFocus = () => {
    if (employeeMetadata.level > 0 && managerResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Update Employee</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdateEmployee} className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Employee Name *</Label>
            <Input
              id="name"
              value={employeeMetadata.name}
              onChange={(e) => setEmployeeMetadata(prev => ({
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
              value={employeeMetadata.email}
              onChange={(e) => setEmployeeMetadata(prev => ({
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
              value={employeeMetadata.mobileNumber}
              onChange={(e) => setEmployeeMetadata(prev => ({
                ...prev,
                mobileNumber: e.target.value
              }))}
              error={!!errors.phone}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}           
          </div>

          <div>
            <Label htmlFor="level">Level *</Label>
            <Select
              defaultValue={String(employeeMetadata.level)} // Use value instead of defaultValue
              onChange={handleLevelChange}
              options={[               
                ...hierarchies.map(h => ({
                  value: String(h.level),
                  label: `${h.hierarchyName} | Level ${h.level}`
                }))
              ]}
            />
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
          </div>

          {employeeMetadata.level > 0 && (
            <div>
              <Label htmlFor="manager">Manager *</Label>
              <div className="relative">
                <Input
                  id="manager"
                  value={searchQuery}
                  onChange={handleManagerSearch}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={employeeMetadata.level ? "Search managers..." : "Select level first"}
                  disabled={!employeeMetadata.level}
                  error={!!errors.manager}
                />
                {isLoadingManagers && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  </div>
                )}
                
                {showDropdown && !isLoadingManagers && managerResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                    {managerResults.map(manager => (
                      <button
                        key={manager.id}
                        type="button"
                        className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                        onClick={() => handleManagerSelect(manager)}
                      >
                        {manager.name} ({manager.email})
                      </button>
                    ))}
                  </div>
                )}
                
                {showDropdown && !isLoadingManagers && managerResults.length === 0 && searchQuery && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    No managers found
                  </div>
                )}
              </div>
              {errors.manager && <p className="text-red-500 text-sm mt-1">{errors.manager}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="isActive">Status</Label>
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={() => setEmployeeMetadata(prev => ({
                  ...prev,
                  isActive: !prev.isActive
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  employeeMetadata.isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    employeeMetadata.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {employeeMetadata.isActive ? 'Active' : 'Inactive'}
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
              {isLoadingButton ? 'Updating...' : 'Update Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}