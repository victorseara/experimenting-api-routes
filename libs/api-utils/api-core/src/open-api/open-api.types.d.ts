import { Document } from 'openapi-client-axios';

export type TOpenApiDefinition = string | Document | any;

export interface IOpenApiAbstract<ClientType> {
  getClient(): Promise<ClientType>;
}

export interface IOpenApiAbstractImplementation<ClientType = {}> {
  new (
    definition: TOpenApiDefinition,
    url: string
  ): IOpenApiAbstract<ClientType>;
  getClient: IOpenApiAbstract<ClientType>['getClient'];
}
