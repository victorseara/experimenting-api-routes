import OpenAPIClientAxios, { AxiosInstance } from 'openapi-client-axios';
import type { IOpenApiAbstract, TOpenApiDefinition } from './open-api.types';
import { ErrorFactory, ILogger } from '../server';

export abstract class OpenApiAbstract<ClientType extends AxiosInstance>
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
          response,
          `[HTTP Response]: ${response.request?.method?.toUpperCase()} ${
            response.config.url
          } succeeded with status code ${response.status}`
        );
        return response;
      },
      (error) => {
        const apiError = ErrorFactory.create(error);

        this.logger.error(
          error,
          `[HTTP Response]: ${error.request?.method?.toUpperCase()} ${
            error.config.url
          } succeeded with status code ${error.status}`
        );

        return Promise.reject(apiError);
      }
    );
  }
}
