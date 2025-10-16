// ==========================================
// FILE: services/relationalManagerServiceApi.ts
// ==========================================

import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";

export interface RelationalManagerDetails {
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

export interface CreateRelationalManagerRequest {
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

export interface UpdateRelationalManagerRequest {
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

class RelationalManagerServiceApi extends API {
  async createRelationalManager(data: CreateRelationalManagerRequest): Promise<APIResponse> {
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

    return this.post(ApiType.private, `${this.baseUrl}/relational-managers/create`, formData);
  }

  async updateRelationalManager(id: number, data: UpdateRelationalManagerRequest): Promise<APIResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('email', data.email);
    formData.append('description', data.description);
    formData.append('age', data.age.toString());
    formData.append('experienceYears', data.experienceYears.toString());
    formData.append('isActive', data.isActive.toString());

    if (data.photo instanceof File) {
      formData.append('photo', data.photo);
    }
    if (data.attachment1 instanceof File) {
      formData.append('attachment1', data.attachment1);
    }
    if (data.attachment2 instanceof File) {
      formData.append('attachment2', data.attachment2);
    }

    return this.patch(ApiType.private, `${this.baseUrl}/relational-managers/${id}`, formData);
  }

  async getRelationalManagers(data: PaginationData): Promise<APIResponse> {
    return this.get(
      ApiType.private,
      `${this.baseUrl}/relational-managers/list?page=${data.page}&search=${data.search || ''}`
    );
  }

  async deleteRelationalManager(id: number): Promise<APIResponse> {
    return this.delete(ApiType.private, `${this.baseUrl}/relational-managers/${id}`);
  }

  async getRelationalManagerStats(): Promise<APIResponse> {
    return this.get(ApiType.private, `${this.baseUrl}/relational-managers/stats`);
  }

  async getRecentRelationalManagers(): Promise<APIResponse> {
    return this.get(ApiType.private, `${this.baseUrl}/relational-managers/recent`);
  }
}

export const relationalManagerServiceApi = new RelationalManagerServiceApi(settings.RELATIONAL_MANAGER_SERVICE);


