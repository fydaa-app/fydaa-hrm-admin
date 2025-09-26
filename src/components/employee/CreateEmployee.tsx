"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Label from "@/components/form/Label";
import { 
    CreateEmployeeRequest,
    employeeServiceApi
} from "@/services/employeeServiceApi";

interface CreateEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
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

const DEFAULT_EMPLOYEE_DATA: CreateEmployeeRequest = {
  name: "",
  mobileNumber: "",
  email: "",
  managerId: undefined,
  level: 0,
  role: "",
  isActive: true,
};

export default function CreateEmployee({ isOpen, onClose }: CreateEmployeeProps) {
  const router = useRouter();
  const [employeeMetadata, setEmployeeMetadata] = useState<CreateEmployeeRequest>(DEFAULT_EMPLOYEE_DATA);
  const [hierarchies, setHierarchies] = useState<Hierarchy[]>([]);
  const [managerResults, setManagerResults] = useState<Manager[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [isLoadinbutton, setIsLoadingbutton] = useState(false);
  
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

  const fetchManagers = useCallback(async (level: number) => {
    if (!level) return;
    
    try {
      setIsLoadingManagers(true);
      const response = await employeeServiceApi.searchManagers({ level });
      const responseData = response.data as Manager[]
      setManagerResults(responseData);
      setSearchQuery(""); // Reset search query when level changes
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch managers');
    } finally {
      setIsLoadingManagers(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchHierarchies();
  }, [isOpen, fetchHierarchies]);

  useEffect(() => {
    if (employeeMetadata.level) {
      fetchManagers(employeeMetadata.level);
    }
  }, [employeeMetadata.level, fetchManagers]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!employeeMetadata.name) newErrors.name = 'Name is required';
    if (!employeeMetadata.email) newErrors.email = 'Email is required';
    if (!employeeMetadata.mobileNumber) newErrors.phone = 'Phone is required';
    if (!employeeMetadata.level) newErrors.level = 'Level is required';
    if (!employeeMetadata.managerId) newErrors.manager = 'Manager is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingbutton(true);
    try {
      await employeeServiceApi.createEmployee({
        ...employeeMetadata,
        role: employeeMetadata.level.toString(),
      });     
       
      toast.success('Employee created successfully');
      router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);  
      // setErrors(error.message);
      closeModal();
      toast.error('Failed to create employee');
    } finally{
      setIsLoadingbutton(false);
    }
  };

  const closeModal = () => {
    setEmployeeMetadata(DEFAULT_EMPLOYEE_DATA);
    setSearchQuery("");
    setManagerResults([]);
    setErrors({});
    onClose();
  };

  const handleLevelChange = (e: string) => {
    const level = Number(e);
    setEmployeeMetadata(prev => ({
      ...prev,
      level,
      managerId: undefined // Reset manager when level changes
    }));
  };

  const handleManagerSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!employeeMetadata.level) return;
    console.log(e);
    try {
      setIsLoadingManagers(true);
      const response = await employeeServiceApi.searchManagers({
        level: employeeMetadata.level
      });
      const responseData = response.data as Manager[]
      setManagerResults(responseData);
    } catch (error) {
      console.error(error);      
      toast.error('Failed to search managers');
    } finally {
      setIsLoadingManagers(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Create New Employee</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleCreateEmployee} className="p-4 space-y-4">
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
            />           
          </div>

          <div>
            <Label htmlFor="level">Level *</Label>
            <Select
              defaultValue={String(employeeMetadata.level) || ""}
              onChange={handleLevelChange}
              options={[               
                ...hierarchies.map(h => ({
                  value: h.level,
                  label: `${h.hierarchyName} | Level ${h.level}`
                }))
              ]}
            />
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
          </div>

          <div>
            <Label htmlFor="manager">Manager *</Label>
            <div className="relative">
              <Input
                id="manager"
                value={searchQuery}
                onChange={handleManagerSearch}
                placeholder={employeeMetadata.level ? "Search managers..." : "Select level first"}
                disabled={!employeeMetadata.level}
                error={!!errors.manager}
              />
              {isLoadingManagers && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
              
              {!isLoadingManagers && managerResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                  {managerResults.map(manager => (
                    <button
                      key={manager.id}
                      type="button"
                      className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                      onClick={() => {
                        setEmployeeMetadata((prev: CreateEmployeeRequest): CreateEmployeeRequest => ({
                          ...prev,
                          managerId: manager.id
                        }));
                        setSearchQuery(manager.name);
                        setManagerResults([]);
                      }}
                    >
                      {manager.name} ({manager.email})
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.manager && <p className="text-red-500 text-sm mt-1">{errors.manager}</p>}
          </div>

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
              disabled = {isLoadinbutton}
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}