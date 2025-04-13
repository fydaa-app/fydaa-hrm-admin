import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { axiosPrivate, axiosPublic } from '@/helpers/api';

export interface APIResponse {
    status: number;
    data: unknown; // Replaced `any` with `unknown` for better type safety
    error: {
        message: string;
        raw?: AxiosError;
    } | null;
}

export enum ApiType {
    public = 'public',
    private = 'private',
}

export default abstract class API {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected handleSuccess(response: AxiosResponse): Promise<APIResponse> {
        return Promise.resolve({
            status: response.status,
            data: response.data,
            error: null,
        });
    }

    protected handleError(error: AxiosError): Promise<APIResponse> {
        if (error.response) {
            return Promise.reject({
                status: error.response.status,
                data: null,
                error: {
                    message: (error.response?.data as { message?: string })?.message || 'Something went wrong. Try again',
                    raw: error,
                },
            });
        } else if (error.request) {
            return Promise.reject({
                status: -1,
                data: null,
                error: {
                    message: 'Something went wrong. Try again',
                    raw: error,
                },
            });
        } else {
            return Promise.reject({
                status: -1,
                data: null,
                error: {
                    message: error.message || 'Something went wrong. Try again',
                    raw: error,
                },
            });
        }
    }

    protected get(
        type: ApiType,
        url: string,
        headers: Record<string, string> = {}, // Replaced `any` with `Record<string, string>`
        options: AxiosRequestConfig = {}
    ): Promise<APIResponse> {
        return (type === ApiType.private ? axiosPrivate : axiosPublic)
            .get(url, {
                headers: {
                    Accept: 'application/json',
                    ...headers,
                },
                ...options,
            })
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    protected delete(
        type: ApiType,
        url: string,
        headers: Record<string, string> = {}, // Replaced `any` with `Record<string, string>`
        options: AxiosRequestConfig = {}
    ): Promise<APIResponse> {
        return (type === ApiType.private ? axiosPrivate : axiosPublic)
            .delete(url, {
                headers: {
                    ...headers,
                },
                ...options,
            })
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    protected post<T = unknown>(
        type: ApiType,
        url: string,
        data: T | null = null, // Replaced `any` with generic type `T`
        headers: Record<string, string> = {}, // Replaced `any` with `Record<string, string>`
        options: AxiosRequestConfig = {}
    ): Promise<APIResponse> {
        return (type === ApiType.private ? axiosPrivate : axiosPublic)
            .post(url, data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                ...options,
            })
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    protected put<T = unknown>(
        type: ApiType,
        url: string,
        data: T | null = null, // Replaced `any` with generic type `T`
        headers: Record<string, string> = {}, // Replaced `any` with `Record<string, string>`
        options: AxiosRequestConfig = {}
    ): Promise<APIResponse> {
        return (type === ApiType.private ? axiosPrivate : axiosPublic)
            .put(url, data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                ...options,
            })
            .then(this.handleSuccess)
            .catch(this.handleError);
    }

    protected patch<T = unknown>(
        type: ApiType,
        url: string,
        data: T | null = null, // Replaced `any` with generic type `T`
        headers: Record<string, string> = {}, // Replaced `any` with `Record<string, string>`
        options: AxiosRequestConfig = {}
    ): Promise<APIResponse> {
        return (type === ApiType.private ? axiosPrivate : axiosPublic)
            .patch(url, data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...headers,
                },
                ...options,
            })
            .then(this.handleSuccess)
            .catch(this.handleError);
    }
}