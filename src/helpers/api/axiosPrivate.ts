import axios from "axios"
import { storageService } from "../storage"

axios.create({ withCredentials: true })
axios.interceptors.request.use(
    async (config) => {
        const session = storageService.get('session')
        const token = session?.token ?? 'invalid'

        if (session?.token) {
            config.headers["Authorization"] = `Bearer ${token}`
            // config.headers = {
            //     ...config.headers,
            //     Authorization: token,
            // }
        }
        return config
    },
    (error) => Promise.reject(error)                  
)

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config

        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true

            // const result = await memoizedRefreshToken()
            const result = storageService.get('session')
            const token = result?.accessToken

            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: token,
                }
            } else {
                storageService.delete('session')
                storageService.delete('accessToken')
                storageService.delete('refreshToken')
                globalThis.location.href = '/'
            }
            return axios(config)
        }
        if (error?.response?.status == 403) {
            storageService.delete('session')
            storageService.delete('accessToken')
            storageService.delete('refreshToken')
            globalThis.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export const axiosPrivate = axios
