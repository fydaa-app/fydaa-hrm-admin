// ==========================================
// FILE: services/advisorServiceApi.ts
// ==========================================

import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";

export interface AdvisorDetails {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  description: string;
  age: number;
  experienceYears: number;
  photo: string;
  attachment1?: string;
  attachment2?: string;
  isActive: boolean;
}

export interface CreateAdvisorRequest {
  name: string;
  mobileNumber: string;
  email: string;
  description: string;
  age: number;
  experienceYears: number;
  photo: File;
  attachment1?: File;
  attachment2?: File;
  isActive: boolean;
}

export interface UpdateAdvisorRequest {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  description: string;
  age: number;
  experienceYears: number;
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
  
  // TODO: Connect this method to your backend API endpoint for creating advisors
  // Expected endpoint: POST /api/advisors/create
  // This should handle multipart/form-data for file uploads
  async createAdvisor(data: CreateAdvisorRequest): Promise<APIResponse> {
    // Create FormData for file uploads
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('email', data.email);
    formData.append('description', data.description);
    formData.append('age', data.age.toString());
    formData.append('experienceYears', data.experienceYears.toString());
    formData.append('isActive', data.isActive.toString());
    
    if (data.photo) {
      formData.append('photo', data.photo);
    }
    if (data.attachment1) {
      formData.append('attachment1', data.attachment1);
    }
    if (data.attachment2) {
      formData.append('attachment2', data.attachment2);
    }

    // TODO: Replace with actual endpoint URL
    return this.post(ApiType.private, `${this.baseUrl}/advisors/create`, formData);
  }

  // TODO: Connect this method to your backend API endpoint for updating advisors
  // Expected endpoint: PATCH /api/advisors/:id
  // This should handle multipart/form-data for file uploads
  async updateAdvisor(id: number, data: UpdateAdvisorRequest): Promise<APIResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('email', data.email);
    formData.append('description', data.description);
    formData.append('age', data.age.toString());
    formData.append('experienceYears', data.experienceYears.toString());
    formData.append('isActive', data.isActive.toString());
    
    // Only append files if they are File objects (new uploads)
    if (data.photo instanceof File) {
      formData.append('photo', data.photo);
    }
    if (data.attachment1 instanceof File) {
      formData.append('attachment1', data.attachment1);
    }
    if (data.attachment2 instanceof File) {
      formData.append('attachment2', data.attachment2);
    }

    // TODO: Replace with actual endpoint URL
    return this.patch(ApiType.private, `${this.baseUrl}/advisors/${id}`, formData);
  }

  // TODO: Connect this method to your backend API endpoint for fetching advisors list
  // Expected endpoint: GET /api/advisors/list?page=1&search=query
  // Expected response format: { data: { advisors: AdvisorDetails[], totalcount: number, totalPages: number } }
  async getAdvisors(data: PaginationData): Promise<APIResponse> {
    // TODO: Replace with actual endpoint URL
    return this.get(
      ApiType.private,
      `${this.baseUrl}/advisors/list?page=${data.page}&search=${data.search || ''}`
    );
  }

  // TODO: Connect this method to your backend API endpoint for deleting an advisor
  // Expected endpoint: DELETE /api/advisors/:id
  async deleteAdvisor(id: number): Promise<APIResponse> {
    // TODO: Replace with actual endpoint URL
    return this.delete(ApiType.private, `${this.baseUrl}/advisors/${id}`);
  }

  // TODO: Connect this method to your backend API endpoint for fetching advisor stats
  // Expected endpoint: GET /api/advisors/stats
  // Expected response: { totalAdvisors: number, activeAdvisors: number, avgExperience: number }
  async getAdvisorStats(): Promise<APIResponse> {
    // TODO: Replace with actual endpoint URL
    return this.get(ApiType.private, `${this.baseUrl}/advisors/stats`);
  }

  // TODO: Connect this method to your backend API endpoint for fetching recent advisors
  // Expected endpoint: GET /api/advisors/recent
  // Expected response: { data: AdvisorDetails[] }
  async getRecentAdvisors(): Promise<APIResponse> {
    // TODO: Replace with actual endpoint URL
    return this.get(ApiType.private, `${this.baseUrl}/advisors/recent`);
  }
}

// TODO: Add ADVISOR_SERVICE URL to settings.ts config file
// Example: ADVISOR_SERVICE: process.env.NEXT_PUBLIC_ADVISOR_SERVICE_URL || 'http://localhost:3000/api'
export const advisorServiceApi = new AdvisorServiceApi(settings.ADVISOR_SERVICE);
