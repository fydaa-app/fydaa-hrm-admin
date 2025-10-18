"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Label from "@/components/form/Label";
import { 
    CreateRelationalManagerRequest,
    relationalManagerServiceApi
} from "@/services/relationalManagerServiceApi";

interface CreateRelationalManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Employee {
  id: number;
  name: string;
  email: string;
}

const DEFAULT_RELATIONAL_MANAGER_DATA: CreateRelationalManagerRequest = {
  name: "",
  mobileNumber: "",
  email: "",
  type: "employee",
  employeeId: undefined,
  isActive: true,
};

export default function CreateRelationalManager({ isOpen, onClose }: CreateRelationalManagerProps) {
  const router = useRouter();
  const [relationalManagerMetadata, setRelationalManagerMetadata] = useState<CreateRelationalManagerRequest>(DEFAULT_RELATIONAL_MANAGER_DATA);
  const [employeeResults, setEmployeeResults] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingbutton, setIsLoadingbutton] = useState(false);
  
  const fetchEmployees = useCallback(async (query?: string) => {
    try {
      setIsLoadingEmployees(true);
      const response = await relationalManagerServiceApi.searchEmployees({ search: query || "" });
      const responseData = response.data as { data: Employee[] };
      setEmployeeResults(responseData.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, fetchEmployees]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!relationalManagerMetadata.name) newErrors.name = 'Name is required';
    if (!relationalManagerMetadata.email) newErrors.email = 'Email is required';
    if (!relationalManagerMetadata.mobileNumber) newErrors.phone = 'Phone is required';
    if (!relationalManagerMetadata.employeeId) newErrors.employee = 'Employee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRelationalManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingbutton(true);
    try {
      await relationalManagerServiceApi.createRelationalManager(relationalManagerMetadata);     
       
      toast.success('Relational Manager created successfully');
      router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);  
      toast.error('Failed to create relational manager');
    } finally{
      setIsLoadingbutton(false);
    }
  };

  const closeModal = () => {
    setRelationalManagerMetadata(DEFAULT_RELATIONAL_MANAGER_DATA);
    setSearchQuery("");
    setEmployeeResults([]);
    setErrors({});
    onClose();
  };

  const handleEmployeeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    const timeoutId = setTimeout(() => {
      fetchEmployees(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Create New Relational Manager</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleCreateRelationalManager} className="p-4 space-y-4">
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
                placeholder="Search employees..."
                error={!!errors.employee}
              />
              {isLoadingEmployees && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
              
              {!isLoadingEmployees && employeeResults.length > 0 && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                  {employeeResults.map(employee => (
                    <button
                      key={employee.id}
                      type="button"
                      className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                      onClick={() => {
                        setRelationalManagerMetadata(prev => ({
                          ...prev,
                          employeeId: employee.id
                        }));
                        setSearchQuery(employee.name);
                        setEmployeeResults([]);
                      }}
                    >
                      {employee.name} ({employee.email})
                    </button>
                  ))}
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
              disabled={isLoadingbutton}
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Relational Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
