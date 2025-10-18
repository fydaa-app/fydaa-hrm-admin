import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";

export interface RelationalManagerDetails {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  type: string;
  employeeId?: number;
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
  type: string;
  employeeId?: number;
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

class RelationalManagerServiceApi extends API {

  async createRelationalManager(data: CreateRelationalManagerRequest): Promise<APIResponse> {    
    return this.post(ApiType.private, `${this.baseUrl}/referrals/relationship-manager`, {
      name: data.name,
      email: data.email,
      mobileNumber: data.mobileNumber,
      type: data.type,
      employeeId: data.employeeId,
      isActive: data.isActive ?? true,
    });
  }

  async updateRelationalManager(id: number, data: UpdateRelationalManagerRequest): Promise<APIResponse> {
    return this.patch(ApiType.private, `${this.baseUrl}/referrals/relationship-manager/${id}`, data);
  }

  async getRelationalManager(data: PaginationData): Promise<APIResponse> {
    const searchParam = data.search ? `&search=${data.search}` : '';
    return this.get(ApiType.private, `${this.baseUrl}/referrals/relationship-manager?page=${data.page}${searchParam}`);
  }

  async deleteRelationalManager(id: number): Promise<APIResponse> {
    return this.delete(ApiType.private, `${this.baseUrl}/referrals/relationship-manager/${id}`);
  }

  async searchEmployees(data: EmployeeSearchData): Promise<APIResponse> {
    const searchParam = data.search ? `?search=${data.search}` : '';
    return this.get(ApiType.private, `${this.baseUrl}/referrals/employees${searchParam}`);
  }

}

export const relationalManagerServiceApi = new RelationalManagerServiceApi(settings.EMPLOYEE_SERVICE);
