import { settings } from "@/helpers/settings/config";
import API, { ApiType, APIResponse } from "./index";
import { storageService } from "@/helpers/storage";
import Cookies from 'js-cookie'; // You'll need to install this package: npm install js-cookie

export interface LoginData {
    email: string,
    password: string,
}

class AuthServiceApi extends API {
    async loginWithCredentials(data: LoginData): Promise<APIResponse> {
        // Using the new login URL
        return this.post(ApiType.public, `${this.baseUrl}/referrals/login-hr`, data)
            .then(response => {
                if (response.data) {
                    // Store session data
                    storageService.set('session', JSON.stringify(response.data))
                    return response
                }
                return response
            })
    }

    logout() {
        storageService.delete('session')
        // Remove cookies instead of local storage items
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
    }
}

export const authServiceApi = new AuthServiceApi(settings.AUTH_SERVICE)