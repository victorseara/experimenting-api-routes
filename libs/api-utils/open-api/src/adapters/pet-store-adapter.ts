import {
  IApiLogger,
  AbstractOpenApi,
  CoreInjectionKeys,
} from '@self/api-core/server';
import { inject, injectable } from 'tsyringe';
import PetStoreDefinition from '../definitions/swagger-pet-store.json';
import * as TPetStore from '../types/swagger-pet-store';

type ServerEnv = {
  PETSTORE_URL: string;
};

@injectable()
export class PetStoreAdapter extends AbstractOpenApi<TPetStore.Client> {
  constructor(
    @inject(CoreInjectionKeys.Env) env: ServerEnv,
    @inject(CoreInjectionKeys.Logger) logger: IApiLogger
  ) {
    super(
      PetStoreDefinition,
      env.PETSTORE_URL,
      logger.getLogger(PetStoreAdapter.name)
    );
  }
}
