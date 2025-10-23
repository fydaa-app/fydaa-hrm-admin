"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/form/input/InputField';
import Label from "@/components/form/Label";
import { 
    AdvisorDetails,
    advisorServiceApi
} from "@/services/advisorServiceApi";

interface EditAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  advisor: AdvisorDetails;
}

export default function EditAdvisor({ isOpen, onClose, advisor }: EditAdvisorProps) {
  const router = useRouter();
  const [advisorMetadata, setAdvisorMetadata] = useState({
    id: advisor.id,
    name: advisor.name,
    mobile: advisor.mobile,
    email: advisor.email,
    description: advisor.description,
    age: advisor.age,
    experienceInYears: advisor.experienceInYears,
    isActive: advisor.isActive
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  useEffect(() => {
    if (isOpen && advisor) {
      setAdvisorMetadata({
        id: advisor.id,
        name: advisor.name,
        mobile: advisor.mobile,
        email: advisor.email,
        description: advisor.description,
        age: advisor.age,
        experienceInYears: advisor.experienceInYears,
        isActive: advisor.isActive
      });
      setPhoto(null);
      setAttachment1(null);
      setAttachment2(null);
    }
  }, [isOpen, advisor]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!advisorMetadata.name) newErrors.name = 'Name is required';
    if (!advisorMetadata.email) newErrors.email = 'Email is required';
    if (!advisorMetadata.mobile) newErrors.mobile = 'Mobile number is required';
    if (!advisorMetadata.description) newErrors.description = 'Description is required';
    if (!advisorMetadata.age || advisorMetadata.age <= 0) newErrors.age = 'Valid age is required';
    if (!advisorMetadata.experienceInYears || advisorMetadata.experienceInYears < 0) newErrors.experienceInYears = 'Valid experience is required';
    
    if (!photo && !advisor.photo) newErrors.photo = 'Photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // TODO: This function updates an existing advisor - ensure backend API endpoint is connected
  const handleUpdateAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingButton(true);
    
    try {
      // TODO: Ensure advisorServiceApi.updateAdvisor handles file uploads properly
      await advisorServiceApi.updateAdvisor(advisorMetadata.id, {
        ...advisorMetadata,
        photo: photo || advisor.photo,
        attachment1: attachment1 || advisor.attachment1,
        attachment2: attachment2 || advisor.attachment2,
      });     
      
      toast.success('Advisor updated successfully');
      router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);  
      toast.error('Failed to update advisor');
    } finally {
      setIsLoadingButton(false);
    }
  };

  const closeModal = () => {
    setErrors({});
    setPhoto(null);
    setAttachment1(null);
    setAttachment2(null);
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
          <h2 className="text-xl font-semibold dark:text-white">Edit Advisor</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdateAdvisor} className="p-4 space-y-4">
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
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                value={advisorMetadata.mobile}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  mobile: e.target.value
                }))}
                error={!!errors.mobile}
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
                value={advisorMetadata.age || ''}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  age: parseInt(e.target.value) || 0
                }))}
                error={!!errors.age}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <Label htmlFor="experienceInYears">Experience (Years) *</Label>
              <Input
                id="experienceInYears"
                type="number"
                value={advisorMetadata.experienceInYears || ''}
                onChange={(e) => setAdvisorMetadata(prev => ({
                  ...prev,
                  experienceInYears: parseInt(e.target.value) || 0
                }))}
                error={!!errors.experienceInYears}
              />
              {errors.experienceInYears && <p className="text-red-500 text-sm mt-1">{errors.experienceInYears}</p>}
            </div>
          </div>

          {/* Current Photo Preview */}
          {advisor.photo && !photo && (
            <div>
              <Label>Current Photo</Label>
              <img src={advisor.photo} alt="Current advisor" className="w-32 h-32 object-cover rounded-lg mt-2" />
            </div>
          )}

          {/* Photo Upload */}
          <div>
          {/* // photo input section */}
<Label htmlFor="photo">Photo * {advisor.photo && '(Upload new to replace)'}</Label>
<input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'photo')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
{!photo && !advisor.photo && errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
{photo && <p className="text-sm text-gray-600 mt-1">New file: {photo.name}</p>}
            
          </div>

          {/* Attachment 1 */}
          <div>
            <Label htmlFor="attachment1">Attachment 1 {advisor.attachment1 && '(Upload new to replace)'}</Label>
            {advisor.attachment1 && !attachment1 && (
              <p className="text-sm text-gray-600 mb-1">Current: <a href={advisor.attachment1} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></p>
            )}
            <input
              id="attachment1"
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment1')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {attachment1 && <p className="text-sm text-gray-600 mt-1">New file: {attachment1.name}</p>}
          </div>

          {/* Attachment 2 */}
          <div>
            <Label htmlFor="attachment2">Attachment 2 {advisor.attachment2 && '(Upload new to replace)'}</Label>
            {advisor.attachment2 && !attachment2 && (
              <p className="text-sm text-gray-600 mb-1">Current: <a href={advisor.attachment2} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></p>
            )}
            <input
              id="attachment2"
              type="file"
              onChange={(e) => handleFileChange(e, 'attachment2')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {attachment2 && <p className="text-sm text-gray-600 mt-1">New file: {attachment2.name}</p>}
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
              {isLoadingButton ? 'Updating...' : 'Update Advisor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}