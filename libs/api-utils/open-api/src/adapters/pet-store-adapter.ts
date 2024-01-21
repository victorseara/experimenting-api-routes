import {
  ErrorFactory,
  IApiLogger,
  ILogger,
  OpenApiAbstract,
  SharedInjectionKeys,
} from '@self/api-core/server';
import PetStoreDefinition from '../definitions/swagger-pet-store.json';
import * as TPetStore from '../types/swagger-pet-store';
import { inject, injectable } from 'tsyringe';
import { AxiosInstance } from 'axios';

type ServerEnv = {
  PETSTORE_URL: string;
};

@injectable()
export class PetStoreAdapter extends OpenApiAbstract<TPetStore.Client> {
  #logger: ILogger;

  constructor(
    @inject(SharedInjectionKeys.Env) env: ServerEnv,
    @inject(SharedInjectionKeys.Logger) logger: IApiLogger
  ) {
    super(PetStoreDefinition, env.PETSTORE_URL);
    this.#logger = logger.getLogger(PetStoreAdapter.name);
  }

  override async getClient(): Promise<TPetStore.Client> {
    const client = await this.api.getClient<TPetStore.Client>();
    this.#addResponseInterceptor(client);
    return client;
  }

  #addResponseInterceptor(client: AxiosInstance) {
    client.interceptors.response.use(
      (response) => {
        this.#logger.info(
          response,
          `[HTTP Response]: ${response.request?.method?.toUpperCase()} ${
            response.config.url
          } succeeded with status code ${response.status}`
        );
        return response;
      },
      (error) => {
        const apiError = ErrorFactory.create(error);

        this.#logger.error(
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
