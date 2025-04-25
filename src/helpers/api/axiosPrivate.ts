import axios from "axios";
import { storageService } from "../storage";

// Define the structure of the session object
interface Session {
  token: string;
  accessToken: string;
  refreshToken: string;
}

axios.create({ withCredentials: true });

axios.interceptors.request.use(
  async (config) => {
    const session = storageService.get<Session>('session'); // Use the Session interface
    const token = session?.token ?? 'invalid';

    if (session?.token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }else {      
      storageService.delete('session');    
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      return Promise.reject(new Error('No authentication token found'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      const result = storageService.get<Session>('session'); // Use the Session interface
      const token = result?.accessToken;

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`, // Add "Bearer" prefix for consistency
        };
      } else {
        storageService.delete('session');
        storageService.delete('accessToken');
        storageService.delete('refreshToken');
        globalThis.location.href = '/';
      }
      return axios(config);
    }
    if (error?.response?.status === 403) {
      storageService.delete('session');
      storageService.delete('accessToken');
      storageService.delete('refreshToken');
      globalThis.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios;