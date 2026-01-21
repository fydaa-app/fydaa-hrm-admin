import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";
import axios from "axios";

export interface AdvisorDetails {
  id: number;
  name: string;
  mobile: string;
  email: string;
  description: string;
  age: number;
  experienceInYears: number;
  photo: string;
  attachment1?: string;
  attachment2?: string;
  isActive: boolean;
}

export interface CreateAdvisorRequest {
  name: string;
  mobile: string;
  email: string;
  description: string;
  age: number;
  experienceInYears: number;
  photo: File;
  attachment1?: File;
  attachment2?: File;
  isActive: boolean;
}

export interface UpdateAdvisorRequest {
  id: number;
  name: string;
  mobile: string;
  email: string;
  description: string;
  age: number;
  experienceInYears: number;
  photo: File | string;
  attachment1?: File | string;
  attachment2?: File | string;
  isActive: boolean;
}

export interface PaginationData {
  page: number;
  search?: string;
}

class AdvisorServiceApi extends API {
  
  async createAdvisor(data: CreateAdvisorRequest): Promise<APIResponse> {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', data.name.trim());
      formData.append('mobile', data.mobile.trim());
      formData.append('email', data.email.trim());
      formData.append('description', data.description.trim());
      formData.append('age', data.age.toString());
      formData.append('experienceInYears', data.experienceInYears.toString());
      formData.append('isActive', data.isActive.toString());
      
      // Append files - IMPORTANT: Use the exact field names your backend expects
      if (data.photo) {
        formData.append('photo', data.photo, data.photo.name);
        console.log('Photo attached:', data.photo.name, 'Size:', data.photo.size);
      }
      
      if (data.attachment1) {
        formData.append('attachment1', data.attachment1, data.attachment1.name);
        console.log('Attachment1 attached:', data.attachment1.name, 'Size:', data.attachment1.size);
      }
      
      if (data.attachment2) {
        formData.append('attachment2', data.attachment2, data.attachment2.name);
        console.log('Attachment2 attached:', data.attachment2.name, 'Size:', data.attachment2.size);
      }

      

      // Make the API call with FormData
      // IMPORTANT: Don't set Content-Type header manually - browser will set it with boundary
      const response = await this.post(
        ApiType.private, 
        `${this.baseUrl}/referrals/advisor`, 
        formData,
        {
          // Remove any Content-Type header to let browser set it automatically
          
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error in createAdvisor:', error);
      throw error;
    }
  }

  async updateAdvisor(id: number, data: UpdateAdvisorRequest): Promise<APIResponse> {
    try {
      const formData = new FormData();
      
      formData.append('name', data.name.trim());
      formData.append('mobile', data.mobile.trim());
      formData.append('email', data.email.trim());
      formData.append('description', data.description.trim());
      formData.append('age', data.age.toString());
      formData.append('experienceInYears', data.experienceInYears.toString());
      formData.append('isActive', data.isActive.toString());
      
      if (data.photo instanceof File) {
        formData.append('photo', data.photo, data.photo.name);
      }
      
      if (data.attachment1 instanceof File) {
        formData.append('attachment1', data.attachment1, data.attachment1.name);
      }
      
      if (data.attachment2 instanceof File) {
        formData.append('attachment2', data.attachment2, data.attachment2.name);
      }

      const response = await this.patch(
        ApiType.private, 
        `${this.baseUrl}/referrals/advisor/${id}`, 
        formData
      );
      
      return response;
    } catch (error) {
      console.error('Error in updateAdvisor:', error);
      throw error;
    }
  }

  async getAdvisors(data: PaginationData): Promise<APIResponse> {
    try {
      const searchParam = data.search ? `&search=${encodeURIComponent(data.search)}` : '';
      const fullUrl = `${this.baseUrl}/referrals/advisor?page=${data.page}${searchParam}`;
      
      const response = await this.get(
        ApiType.private,
        fullUrl
      );
      
      return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          throw error;
        }
        throw error;
      }
  }



  async deleteAdvisor(id: number): Promise<APIResponse> {
    try {
      const response = await this.delete(
        ApiType.private, 
        `${this.baseUrl}/referrals/advisor/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error in deleteAdvisor:', error);
      throw error;
    }
  }
}

// Export instance
export const advisorServiceApi = new AdvisorServiceApi(settings.ADVISOR_SERVICE);