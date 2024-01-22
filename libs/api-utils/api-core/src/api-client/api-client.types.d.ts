import { AxiosResponse } from 'axios';
import { NextApiRequest, GetServerSidePropsContext } from 'next';
import { TRouteResponse } from '../server';

export type SSRRequest = NextApiRequest | GetServerSidePropsContext['req'];

type TAxiosResponse<T> = Promise<AxiosResponse<T>>;
export type THttpClientResponse<T> = TAxiosResponse<TRouteResponse<T>>;

interface IHttpClient {
  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): THttpClientResponse<T>;
  get<T>(url: string, config?: AxiosRequestConfig): THttpClientResponse<T>;
  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): THttpClientResponse<T>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): THttpClientResponse<T>;
  delete(url: string, config?: AxiosRequestConfig): THttpClientResponse<T>;
}
