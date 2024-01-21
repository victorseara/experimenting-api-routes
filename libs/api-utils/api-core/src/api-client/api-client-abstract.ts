import axios, { AxiosInstance } from 'axios';
import type { SSRRequest } from './api-client.types';

export abstract class AbstractApiClient<Input, Output> {
  protected client: AxiosInstance;

  constructor(client?: AxiosInstance, ssrRequest?: SSRRequest) {
    this.client = this.#getClient(client, ssrRequest);
  }

  abstract execute(input?: Input): Promise<Output>;

  #getClient(client?: AxiosInstance, ssrRequest?: SSRRequest) {
    return client ?? this.#createSSRClient(ssrRequest);
  }

  #createSSRClient(ssrRequest?: SSRRequest) {
    return axios.create({
      headers: {
        cookie: ssrRequest?.headers.cookie,
      },
    });
  }
}
