import { settings } from "@/helpers/settings/config"
import API, { ApiType, APIResponse } from "./index"

export interface PaginationData {
    page: number,
    search?: string,
    
}

class HierarchyServiceApi extends API {    
    
    async getHierarchy(data: PaginationData): Promise<APIResponse> {
        return this.get(ApiType.private, `${this.baseUrl}/referrals/hierarchy-list?page=${data.page}&search=${data.search}`)
    }
}

export const hierarchyServiceApi = new HierarchyServiceApi(settings.HEIRARCHY_SERVICE)
