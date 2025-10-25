import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";


export interface RelationalManagerDetails {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  type: 'employee' | 'company_appointee';
  employeeId?: number;
  photo?: string; 
  description?: string;
  isActive?: boolean;
  employee?: {
    id: number;
    name: string;
    email: string;
  };
}


export interface CreateRelationalManagerRequest {
  name: string;
  email: string;
  mobileNumber: string;
  type: 'employee' | 'company_appointee';
  employeeId?: number;
  photo?: File | string;
  description?: string;
  isActive?: boolean;
}


export interface UpdateRelationalManagerRequest extends CreateRelationalManagerRequest {
  id: number;
}


export interface PaginationData {
  page: number;
  search?: string;
}


export interface EmployeeSearchData {
  search: string;
}


export interface Employee {
  id: number;
  name: string;
  email: string;
}


export interface ApiResponseData {
  data?: Employee[] | {
    data: Employee[];
  };
}


class RelationalManagerServiceApi extends API {

  async createRelationalManager(data: CreateRelationalManagerRequest): Promise<APIResponse> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('type', data.type);
    
    if (data.type === 'employee' && data.employeeId) {
      formData.append('employeeId', data.employeeId.toString());
    }
    
    if (data.photo instanceof File) {
      formData.append('photo', data.photo);
    }
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    formData.append('isActive', String(data.isActive ?? true));
    
    return this.post(ApiType.private, `${this.baseUrl}/referrals/relationship-manager`, formData);
  }

  async updateRelationalManager(id: number, data: UpdateRelationalManagerRequest): Promise<APIResponse> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('type', data.type);
    
    if (data.type === 'employee' && data.employeeId) {
      formData.append('employeeId', data.employeeId.toString());
    }
    
    if (data.photo instanceof File) {
      formData.append('photo', data.photo);
    }
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    formData.append('isActive', String(data.isActive ?? true));
    
    return this.patch(ApiType.private, `${this.baseUrl}/referrals/relationship-manager/${id}`, formData);
  }

  async getRelationalManager(data: PaginationData): Promise<APIResponse> {
  const searchParam = data.search ? `&search=${data.search}` : '&search=';
  return this.get(ApiType.private, `${this.baseUrl}/referrals/relationship-manager?page=${data.page}${searchParam}`);
}



  async deleteRelationalManager(id: number): Promise<APIResponse> {
    return this.delete(ApiType.private, `${this.baseUrl}/referrals/relationship-manager/${id}`);
  }

  async searchEmployees(data: EmployeeSearchData): Promise<APIResponse> {
    const searchParam = data.search ? `&search=${data.search}` : '';
    return this.get(ApiType.private, `${this.baseUrl}/referrals/employee-list?limit=100${searchParam}`);
  }
}


export const relationalManagerServiceApi = new RelationalManagerServiceApi(settings.EMPLOYEE_SERVICE);
