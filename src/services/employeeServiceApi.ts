import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";

export interface employeeData {
  name: string;
  level: number;
}

export interface ParentData {
  id: string;
  name: string;
  level: number;
}

export interface EmployeeDetails {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  level: number;
  role: string;
  managerId?: number;
  managerName:string;
}

export interface HierarchyData {
  id: string,
  name: string,
  level: number,
}

export interface Employee{
  level: number,
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  managerId?: number;  // Use consistent field name
  level: number;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: number;
}
export interface PaginationData {
  page: number,
  search?: string,
  
}

class EmployeeServiceApi extends API {

  async createEmployee(data: CreateEmployeeRequest): Promise<APIResponse> {    
    return this.post(ApiType.private, `${this.baseUrl}/referrals/create-employee`, {
      name: data.name,
      role: data.role,
      managerId:data.managerId,
      mobileNumber: data.mobileNumber,
      email: data.email
    });
   
  }

  async updateEmployee(id: number,data: UpdateEmployeeRequest
  ): Promise<APIResponse> {
      return this.patch(ApiType.private,`${this.baseUrl}/referrals/employees/${id}`,data);
  }

  async getEmployee(data: PaginationData): Promise<APIResponse> {
      return this.get(ApiType.private, `${this.baseUrl}/referrals/employee-list?page=${data.page}&search=${data.search}`)
  }

  async deleteEmployee(id: number): Promise<APIResponse> {
    return this.delete(ApiType.private,`${this.baseUrl}/referrals/employees/${id}`);
  }

  async getHierarchies(): Promise<APIResponse> {
    return this.get(ApiType.private, `${this.baseUrl}/referrals/hierarchies`);
  }

  async getEmployeeStats(): Promise<APIResponse> {
    return this.get(ApiType.private, `${this.baseUrl}/referrals/employees/stats`);
  }

  async getRecentEmployees(): Promise<APIResponse> {
    return this.get(ApiType.private, `${this.baseUrl}/referrals/employees/recent`);
  }
 
  async searchManagers(data: Employee): Promise<APIResponse> {
    return this.get(ApiType.private,`${this.baseUrl}/referrals/managers/${data.level}`);
  }

}

export const employeeServiceApi = new EmployeeServiceApi(settings.EMPLOYEE_SERVICE);