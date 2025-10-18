"use client";
import { useState } from 'react';
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

const DEFAULT_RELATIONAL_MANAGER_DATA: Omit<CreateRelationalManagerRequest, 'photo' | 'attachment1' | 'attachment2'> = {
  name: "",
  mobileNumber: "",
  email: "",
  description: "",
  age: 0,
  experienceYears: 0,
  isActive: true,
};

export default function CreateRelationalManager({ isOpen, onClose }: CreateRelationalManagerProps) {
  const router = useRouter();
  const [relationalManagerMetadata, setRelationalManagerMetadata] = useState(DEFAULT_RELATIONAL_MANAGER_DATA);
  const [photo, setPhoto] = useState<File | null>(null);
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!relationalManagerMetadata.name) newErrors.name = 'Name is required';
    if (!relationalManagerMetadata.email) newErrors.email = 'Email is required';
    if (!relationalManagerMetadata.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (!relationalManagerMetadata.description) newErrors.description = 'Description is required';
    if (!relationalManagerMetadata.age || relationalManagerMetadata.age <= 0) newErrors.age = 'Valid age is required';
    if (!relationalManagerMetadata.experienceYears || relationalManagerMetadata.experienceYears < 0) newErrors.experienceYears = 'Valid experience is required';
    if (!photo) newErrors.photo = 'Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRelationalManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingButton(true);
    
    try {
      await relationalManagerServiceApi.createRelationalManager({
        ...relationalManagerMetadata,
        photo: photo!,
        attachment1: attachment1 || undefined,
        attachment2: attachment2 || undefined,
      });     
       
      toast.success('Relational Manager created successfully');
      router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);  
      toast.error('Failed to create relational manager');
    } finally {
      setIsLoadingButton(false);
    }
  };

  const closeModal = () => {
    setRelationalManagerMetadata(DEFAULT_RELATIONAL_MANAGER_DATA);
    setPhoto(null);
    setAttachment1(null);
    setAttachment2(null);
    setErrors({});
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'photo' | 'attachment1' | 'attachment2') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      if (fileType === 'photo') {
        if (!file.type.startsWith('image/')) {
          toast.error('Photo must be an image file');
          return;
        }
        setPhoto(file);
      } else if (fileType === 'attachment1') {
        setAttachment1(file);
      } else if (fileType === 'attachment2') {
        setAttachment2(file);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-semibold dark:text-white">Create New Relational Manager</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 text-2xl"
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

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                value={relationalManagerMetadata.mobileNumber}
                onChange={(e) => setRelationalManagerMetadata(prev => ({
                  ...prev,
                  mobileNumber: e.target.value
                }))}
                error={!!errors.mobileNumber}
              />
              {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={relationalManagerMetadata.description}
              onChange={(e) => setRelationalManagerMetadata(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={relationalManagerMetadata.age || ''}
                onChange={(e) => setRelationalManagerMetadata(prev => ({
                  ...prev,
                  age: parseInt(e.target.value) || 0
                }))}
                error={!!errors.age}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <Label htmlFor="experienceYears">Experience (Years) *</Label>
              <Input
                id="experienceYears"
                type="number"
                value={relationalManagerMetadata.experienceYears || ''}
                onChange={(e) => setRelationalManagerMetadata(prev => ({
                  ...prev,
                  experienceYears: parseInt(e.target.value) || 0
                }))}
                error={!!errors.experienceYears}
              />
              {errors.experienceYears && <p className="text-red-500 text-sm mt-1">{errors.experienceYears}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="photo">Photo *</Label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'photo')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {photo && <p className="text-sm text-gray-600 mt-1">Selected: {photo.name}</p>}
          </div>

          <div>
            <Label htmlFor="attachment1">Attachment 1</Label>
            <input
              id="attachment1"
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment1')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {attachment1 && <p className="text-sm text-gray-600 mt-1">Selected: {attachment1.name}</p>}
          </div>

          <div>
            <Label htmlFor="attachment2">Attachment 2</Label>
            <input
              id="attachment2"
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment2')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {attachment2 && <p className="text-sm text-gray-600 mt-1">Selected: {attachment2.name}</p>}
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
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoadingButton ? 'Creating...' : 'Create Relational Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


