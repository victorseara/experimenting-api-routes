import type { AxiosInstance, Document } from 'openapi-client-axios';
import type { ILogger } from '../logger/logger.types';
import type { TOpenApiDefinition } from './open-api.types';

export type TOpenApiDefinition = string | Document | any;

export interface IOpenApiAbstract<ClientType> {
  getClient(token?: string): Promise<ClientType>;
}

export interface IAbstractOpenApiImplementation<
  ClientType extends AxiosInstance
> {
  api: OpenAPIClientAxios;
  logger: ILogger;
  getClient(token?: string): Promise<ClientType>;
  addAuthHeader(
    client: AxiosInstance,
    token?: string,
    headerKey?: string
  ): void;
}
