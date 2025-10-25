"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Label from "@/components/form/Label";
import { 
    UpdateRelationalManagerRequest,
    RelationalManagerDetails,
    Employee,
    ApiResponseData,
    relationalManagerServiceApi
} from "@/services/relationalManagerServiceApi";

interface UpdateRelationalManagerProps {
  isOpen: boolean;
  onClose: () => void;
  relationalManager: RelationalManagerDetails;
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
    appointeeName: relationalManager.appointeeName || "",
    profilePicture: relationalManager.profilePicture || undefined,
    description: relationalManager.description || "",
    isActive: relationalManager.isActive ?? true
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(relationalManager.profilePicture || null);
  
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoadingEmployees(true);
      const response = await relationalManagerServiceApi.searchEmployees({ search: "" });
      
      // Type-safe handling
      const responseData = response as unknown as ApiResponseData;
      let employeeData: Employee[] = [];
      
      if (responseData.data) {
        if (Array.isArray(responseData.data)) {
          employeeData = responseData.data;
        } else if ('data' in responseData.data && Array.isArray(responseData.data.data)) {
          employeeData = responseData.data.data;
        }
      }
      
      setEmployees(employeeData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && relationalManagerMetadata.type === 'employee') {
      fetchEmployees();
    }
  }, [isOpen, relationalManagerMetadata.type, fetchEmployees]);

  useEffect(() => {
    if (isOpen && relationalManager) {
      setRelationalManagerMetadata({
        id: relationalManager.id,
        name: relationalManager.name,
        mobileNumber: relationalManager.mobileNumber,
        email: relationalManager.email,
        type: relationalManager.type || "employee",
        employeeId: relationalManager.employeeId,
        appointeeName: relationalManager.appointeeName || "",
        profilePicture: relationalManager.profilePicture || undefined,
        description: relationalManager.description || "",
        isActive: relationalManager.isActive ?? true
      });
      setPreviewImage(relationalManager.profilePicture || null);
    }
  }, [isOpen, relationalManager]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!relationalManagerMetadata.name) newErrors.name = 'Name is required';
    if (!relationalManagerMetadata.email) newErrors.email = 'Email is required';
    if (!relationalManagerMetadata.mobileNumber) newErrors.phone = 'Phone is required';
    
    if (relationalManagerMetadata.type === 'employee') {
      if (!relationalManagerMetadata.employeeId) newErrors.employee = 'Employee is required';
    } else if (relationalManagerMetadata.type === 'company_appointee') {
      if (!relationalManagerMetadata.appointeeName) newErrors.appointee = 'Appointee name is required';
    }

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
    setEmployees([]);
    setErrors({});
    onClose();
  };

  const handleEmployeeChange = (value: string) => {
    setRelationalManagerMetadata(prev => ({
      ...prev,
      employeeId: Number(value)
    }));
  };

  const handleTypeChange = (value: string) => {
    setRelationalManagerMetadata(prev => ({
      ...prev,
      type: value as 'employee' | 'company_appointee',
      employeeId: undefined,
      appointeeName: ""
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only PNG, JPG, or JPEG images');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setRelationalManagerMetadata(prev => ({
        ...prev,
        profilePicture: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setRelationalManagerMetadata(prev => ({
      ...prev,
      profilePicture: undefined
    }));
    setPreviewImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
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
            <Label htmlFor="profilePicture">Profile Picture </Label>
            <div className="mt-2">
              {previewImage ? (
                <div className="relative inline-block">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (Max 5MB)</p>
                  </div>
                  <input
                    id="profilePicture"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description </Label>
            <textarea
              id="description"
              rows={3}
              value={relationalManagerMetadata.description || ""}
              onChange={(e) => setRelationalManagerMetadata(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              placeholder="Enter description..."
            />
          </div>

          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              defaultValue={relationalManagerMetadata.type}
              onChange={handleTypeChange}
              options={[
                { value: "employee", label: "Employee" },
                { value: "company_appointee", label: "Company Appointee" }
              ]}
            />
          </div>

          {relationalManagerMetadata.type === 'employee' ? (
            <div>
              <Label htmlFor="employee">Employee *</Label>
              {isLoadingEmployees ? (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading employees...</span>
                </div>
              ) : (
                <Select
                  defaultValue={relationalManagerMetadata.employeeId ? String(relationalManagerMetadata.employeeId) : ""}
                  onChange={handleEmployeeChange}
                  options={[
                    { value: "", label: "Select an employee" },
                    ...employees.map(emp => ({
                      value: String(emp.id),
                      label: `${emp.name} (${emp.email})`
                    }))
                  ]}
                />
              )}
              {errors.employee && <p className="text-red-500 text-sm mt-1">{errors.employee}</p>}
            </div>
          ) : (
            <div>
              <Label htmlFor="appointeeName">Appointee Name *</Label>
              <Input
                id="appointeeName"
                value={relationalManagerMetadata.appointeeName || ""}
                onChange={(e) => setRelationalManagerMetadata(prev => ({
                  ...prev,
                  appointeeName: e.target.value
                }))}
                error={!!errors.appointee}
                placeholder="Enter appointee name"
              />
              {errors.appointee && <p className="text-red-500 text-sm mt-1">{errors.appointee}</p>}
            </div>
          )}

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
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoadingButton ? 'Updating...' : 'Update Relational Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
