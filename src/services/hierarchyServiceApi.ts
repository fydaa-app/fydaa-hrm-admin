import { settings } from "@/helpers/settings/config"
import API, { ApiType, APIResponse } from "./index"

export interface PaginationData {
    page: number,
    search?: string,    
}

export interface CreateHierarchyRequest {
    hierarchyName: string;
    level: number;
    target: number;
    totalUsers: number;
    totalRevenue: number;
}

class HierarchyServiceApi extends API {    
    
     async createHierarchy(data: CreateHierarchyRequest): Promise<APIResponse> {            
        return this.post(ApiType.private, `${this.baseUrl}/referrals/create-hierarchy`, {
          hierarchyName: data.hierarchyName,
          level: data.level,
          target:data.target,
          totalUsers: data.totalUsers,
          totalRevenue: data.totalRevenue
        });
       
      }

    async updateHierarchy(
        id: number,
        data: {
        hierarchyName: string;
        level: number;
        target: number;
        totalUsers: number;
        totalRevenue: number;
        }
    ): Promise<APIResponse> {
        return this.patch(ApiType.private,`${this.baseUrl}/referrals/hierarchies/${id}`,data);
    }

    async deleteHierarchy(id: number): Promise<APIResponse> {
        return this.delete(ApiType.private,`${this.baseUrl}/referrals/hierarchies/${id}`);
    }
      

    async getHierarchy(data: PaginationData): Promise<APIResponse> {
        return this.get(ApiType.private, `${this.baseUrl}/referrals/hierarchy-list?page=${data.page}&search=${data.search}`)
    }
}

export const hierarchyServiceApi = new HierarchyServiceApi(settings.HEIRARCHY_SERVICE)
