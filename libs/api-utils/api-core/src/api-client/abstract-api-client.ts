import type { IHttpClient, SSRRequest } from './api-client.types';
import { HttpClient } from './http-client';

export abstract class AbstractApiClient<Output, Input = undefined> {
  protected client: IHttpClient;

  constructor(client?: IHttpClient, ssrRequest?: SSRRequest) {
    this.client = this.#getClient(client, ssrRequest);
  }

  abstract execute(input?: Input): Promise<Output>;

  #getClient(client?: IHttpClient, ssrRequest?: SSRRequest) {
    return client ?? new HttpClient(undefined, this.#getSsrHeaders(ssrRequest));
  }

  #getSsrHeaders(ssrRequest?: SSRRequest) {
    return {
      headers: {
        cookie: ssrRequest?.headers.cookie,
      },
    };
  }
}
