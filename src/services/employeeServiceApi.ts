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

export interface createEmployeeData {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  level: number;
  parents?: ParentData[];
  currentParentId?: string;
  mobileNumber: string;
  managerId?:number;
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

export interface PaginationData {
  pageSize: number;
  pageNumber: number;
  query?: string;
  queryFields?: string;
  filter?: string;
  filterFields?: string;
  aggregation?: boolean;
}

class EmployeeServiceApi extends API {

  async createEmployee(data: CreateEmployeeRequest): Promise<APIResponse> {    
    return this.post(ApiType.private, `${this.baseUrl}/referrals/create-employee`, {
      name: data.name,
      role: data.level.toString(),
      managerId:data.managerId,
      mobileNumber: data.mobileNumber,
      email: data.email
    });
   
  }
  
  async getEmployee(data: PaginationData): Promise<APIResponse> {
    return this.get(
      ApiType.private,
      `${this.baseUrl}/searchAndPaginate`,
      {},
      {
        params: {
          pageSize: +data.pageSize,
          pageNumber: +data.pageNumber,
          query: data.query,
          queryFields: data.queryFields,
          filter: data.filter,
          filterFields: data.filterFields,
          aggregation: data.aggregation,
        },
      }
    );
  }

  async getHierarchies(): Promise<APIResponse> {
    return this.get(ApiType.private, `${this.baseUrl}/referrals/hierarchies`);
  }

  async searchManagers(data: Employee): Promise<APIResponse> {
    return this.get(ApiType.private,`${this.baseUrl}/referrals/managers/${data.level}`);
  }

}

export const employeeServiceApi = new EmployeeServiceApi(settings.EMPLOYEE_SERVICE);