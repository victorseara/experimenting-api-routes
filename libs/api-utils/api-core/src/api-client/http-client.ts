import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios';
import { IHttpClient } from './api-client.types';

export class HttpClient implements IHttpClient {
  #client: AxiosInstance;

  constructor(client?: AxiosInstance, config?: CreateAxiosDefaults<unknown>) {
    this.#client = client ?? axios.create(config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.#client.post<T>(url, data, config);
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.#client.get<T>(url, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.#client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.#client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.#client.delete<T>(url, config);
  }
}
