"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Label from "@/components/form/Label";
import { 
    CreateAdvisorRequest,
    advisorServiceApi
} from "@/services/advisorServiceApi";

interface CreateAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_ADVISOR_DATA: Omit<CreateAdvisorRequest, 'photo' | 'attachment1' | 'attachment2'> = {
  name: "",
  mobile: "",
  email: "",
  description: "",
  age: 0,
  experienceInYears: 0,
  isActive: true,
};

export default function CreateAdvisor({ isOpen, onClose }: CreateAdvisorProps) {
  const router = useRouter();
  const [advisorMetadata, setAdvisorMetadata] = useState(DEFAULT_ADVISOR_DATA);
  const [photo, setPhoto] = useState<File | null>(null);
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!advisorMetadata.name.trim()) newErrors.name = 'Name is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!advisorMetadata.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(advisorMetadata.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Mobile (10-digit) OR landline (8-digit)
    const phoneRegex = /^([6-9]\d{9}|\d{8})$/;

    if (!advisorMetadata.mobile.trim()) {
      newErrors.mobile = 'Mobile or landline number is required';
    } else if (!phoneRegex.test(advisorMetadata.mobile)) {
      newErrors.mobile = 'Invalid number (10-digit mobile or 8-digit landline)';
    }
    
    if (!advisorMetadata.description.trim()) newErrors.description = 'Description is required';
    
    if (!advisorMetadata.age || advisorMetadata.age <= 0 || advisorMetadata.age > 120) {
      newErrors.age = 'Valid age is required (1-120)';
    }
    
    if (advisorMetadata.experienceInYears < 0 || advisorMetadata.experienceInYears > 70) {
      newErrors.experienceInYears = 'Valid experience is required (0-70)';
    }
    
    if (!photo) newErrors.photo = 'Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all validation errors');
      return;
    }
    
    setIsLoadingButton(true);
    
    try {
      const response = await advisorServiceApi.createAdvisor({
        ...advisorMetadata,
        photo: photo!,
        attachment1: attachment1 || undefined,
        attachment2: attachment2 || undefined,
      });
      
      // Check for successful response (200 or 201)
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Advisor created successfully');
        router.refresh();
        closeModal();
      } else {
        toast.error('Failed to create advisor');
      }
    } catch (error) {
      console.error('Error creating advisor:', error);
      toast.error('Failed to create advisor. Please try again.');
    } finally {
      setIsLoadingButton(false);
    }
  };

  const closeModal = () => {
    setAdvisorMetadata(DEFAULT_ADVISOR_DATA);
    setPhoto(null);
    setAttachment1(null);
    setAttachment2(null);
    setErrors({});
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'photo' | 'attachment1' | 'attachment2') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      e.target.value = ''; // Clear the input
      return;
    }
    
    if (fileType === 'photo') {
      // Validate image file type
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Photo must be an image file (JPEG, PNG, GIF, or WebP)');
        e.target.value = ''; // Clear the input
        return;
      }
      setPhoto(file);
      // Clear error if exists
      if (errors.photo) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.photo;
          return newErrors;
        });
      }
    } else if (fileType === 'attachment1') {
      setAttachment1(file);
    } else if (fileType === 'attachment2') {
      setAttachment2(file);
    }
  };

  const removeFile = (fileType: 'photo' | 'attachment1' | 'attachment2') => {
    if (fileType === 'photo') {
      setPhoto(null);
      // Reset file input
      const input = document.getElementById('photo') as HTMLInputElement;
      if (input) input.value = '';
    } else if (fileType === 'attachment1') {
      setAttachment1(null);
      const input = document.getElementById('attachment1') as HTMLInputElement;
      if (input) input.value = '';
    } else if (fileType === 'attachment2') {
      setAttachment2(null);
      const input = document.getElementById('attachment2') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-semibold dark:text-white">Create New Advisor</h2>
          <button
            onClick={closeModal}
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleCreateAdvisor} className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Advisor Name *</Label>
            <Input
              id="name"
              value={advisorMetadata.name}
              onChange={(e) => setAdvisorMetadata(prev => ({
                ...prev,
                name: e.target.value
              }))}
              error={!!errors.name}
              placeholder="Enter advisor name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={advisorMetadata.email}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                error={!!errors.email}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="mobile">Mobile/Landline Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={advisorMetadata.mobile}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  mobile: e.target.value.replace(/\D/g, '').slice(0, 10)
                }))}
                error={!!errors.mobile}
                placeholder="9876543210 or 12345678"
                maxLength={10}
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={advisorMetadata.description}
              onChange={(e) => setAdvisorMetadata(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className={`w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-200'} bg-transparent py-2.5 px-4 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white/90`}
              rows={4}
              placeholder="Enter advisor description..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={advisorMetadata.age || ''}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  age: parseInt(e.target.value) || 0
                }))}
                error={!!errors.age}
                placeholder="Enter age"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <Label htmlFor="experienceInYears">Experience (Years) *</Label>
              <Input
                id="experienceInYears"
                type="number"
                min="0"
                max="70"
                value={advisorMetadata.experienceInYears || ''}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  experienceInYears: parseInt(e.target.value) || 0
                }))}
                error={!!errors.experienceInYears}
                placeholder="Years of experience"
              />
              {errors.experienceInYears && <p className="text-red-500 text-sm mt-1">{errors.experienceInYears}</p>}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <Label htmlFor="photo">Photo * (JPEG, PNG, GIF - Max 5MB)</Label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={(e) => handleFileChange(e, 'photo')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            {photo && (
              <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-300">📷 {photo.name} ({(photo.size / 1024).toFixed(2)} KB)</p>
                <button
                  type="button"
                  onClick={() => removeFile('photo')}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Attachment 1 */}
          <div>
            <Label htmlFor="attachment1">Attachment 1 (Optional - Max 5MB)</Label>
            <input
              id="attachment1"
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment1')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
            {attachment1 && (
              <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-300">📎 {attachment1.name} ({(attachment1.size / 1024).toFixed(2)} KB)</p>
                <button
                  type="button"
                  onClick={() => removeFile('attachment1')}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Attachment 2 */}
          <div>
            <Label htmlFor="attachment2">Attachment 2 (Optional - Max 5MB)</Label>
            <input
              id="attachment2"
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment2')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
            {attachment2 && (
              <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-300">📎 {attachment2.name} ({(attachment2.size / 1024).toFixed(2)} KB)</p>
                <button
                  type="button"
                  onClick={() => removeFile('attachment2')}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <div>
            <Label htmlFor="isActive">Status</Label>
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={() => setAdvisorMetadata(prev => ({
                  ...prev,
                  isActive: !prev.isActive
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  advisorMetadata.isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                aria-label="Toggle status"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    advisorMetadata.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {advisorMetadata.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoadingButton}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              disabled={isLoadingButton}
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingButton && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoadingButton ? 'Creating...' : 'Create Advisor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}