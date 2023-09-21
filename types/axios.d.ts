
import { Axios, AxiosResponse, AxiosRequestConfig } from "axios";


declare module "axios" {
    interface AxiosResponse<T = any> {
        code: number;
        data: string | null | object;
        message: string | null;
    }
    export function create(config?: AxiosRequestConfig): AxiosInstance;
}