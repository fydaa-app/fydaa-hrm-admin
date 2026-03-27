import { settings } from "@/helpers/settings/config"
import API, { ApiType, APIResponse } from "./index"

export interface PaginationData {
    page: number,
    search?: string,    
}

class StudentServiceApi extends API {    
    
    async getStudents(data: PaginationData): Promise<APIResponse> {
        return this.get(ApiType.private, `${this.baseUrl}/referrals/website-lead-students?page=${data.page}&search=${data.search}`)
    }
}

export const studentServiceApi = new StudentServiceApi(settings.API_SERVICE)
