import { AxiosInstance, Document } from 'openapi-client-axios';

export type TOpenApiDefinition = string | Document | any;

export interface IOpenApiAbstract<ClientType> {
  getClient(token?: string): Promise<ClientType>;
}

export interface IOpenApiAbstractImplementation<
  ClientType extends AxiosInstance = {}
> {
  new (
    definition: TOpenApiDefinition,
    url: string
  ): IOpenApiAbstract<ClientType>;
  getClient: IOpenApiAbstract<ClientType>['getClient'];
}
