import { AxiosError, AxiosResponse } from 'axios';
import OpenAPIClientAxios, { AxiosInstance } from 'openapi-client-axios';
import { ErrorFactory, ILogger } from '../server';
import type { IOpenApiAbstract, TOpenApiDefinition } from './open-api.types';

export abstract class AbstractOpenApi<ClientType extends AxiosInstance>
  implements IOpenApiAbstract<ClientType>
{
  protected api: OpenAPIClientAxios;
  constructor(
    definition: TOpenApiDefinition,
    url: string,
    private readonly logger: ILogger
  ) {
    this.api = new OpenAPIClientAxios({ definition, withServer: { url } });
  }

  async getClient(token?: string): Promise<ClientType> {
    const client = await this.api.getClient<ClientType>();
    this.addAuthHeader(client, token);
    this.addResponseInterceptor(client);
    return client;
  }

  protected addAuthHeader(
    client: AxiosInstance,
    token?: string,
    headerKey = 'Authorization'
  ) {
    client.defaults.headers.common = {
      ...client.defaults.headers.common,
      [headerKey]: token,
    };
  }

  protected addResponseInterceptor(client: AxiosInstance) {
    client.interceptors.response.use(
      (response) => {
        this.logger.info(
          this.#formatResponse(response),
          `[HTTP Response]: ${response.request?.method?.toUpperCase()} ${
            response.config.baseURL
          }${response.config.url}`
        );
        return response;
      },
      (error) => {
        const apiError = ErrorFactory.create(error);

        this.logger.error(
          this.#formatError(error),
          `[HTTP Response]: ${error.request?.method?.toUpperCase()} ${
            error.config.baseURL
          }${error.config.url}`
        );

        return Promise.reject(apiError);
      }
    );
  }

  #formatResponse(response: AxiosResponse) {
    const dataString = JSON.stringify(response.data);
    const dataSizeKB = dataString.length / 512;

    return {
      status: response.status,
      data: Boolean(response.data),
      size: dataSizeKB.toFixed(2).concat('KB'),
      request: {
        method: response.request?.method?.toUpperCase(),
        url: `${response.config.baseURL}${response.config.url}`,
        headers: response.config.headers,
        params: response.config.params,
      },
    };
  }

  #formatError(error: AxiosError) {
    return {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      request: {
        method: error.request?.method?.toUpperCase(),
        url: `${error.config?.baseURL}${error.config?.url}`,
        headers: error.config?.headers,
        params: error.config?.params,
      },
    };
  }
}
