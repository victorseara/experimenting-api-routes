import OpenAPIClientAxios from 'openapi-client-axios';
import type { IOpenApiAbstract, TOpenApiDefinition } from './open-api.types';

export abstract class OpenApiAbstract<ClientType>
  implements IOpenApiAbstract<ClientType>
{
  protected api: OpenAPIClientAxios;
  constructor(definition: TOpenApiDefinition, url: string) {
    this.api = new OpenAPIClientAxios({ definition, withServer: url });
  }

  async getClient(): Promise<ClientType> {
    return this.api.getClient<ClientType>();
  }
}
