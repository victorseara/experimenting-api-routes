import {
  IApiLogger,
  OpenApiAbstract,
  SharedInjectionKeys,
} from '@self/api-core/server';
import { inject, injectable } from 'tsyringe';
import PetStoreDefinition from '../definitions/swagger-pet-store.json';
import * as TPetStore from '../types/swagger-pet-store';

type ServerEnv = {
  PETSTORE_URL: string;
};

@injectable()
export class PetStoreAdapter extends OpenApiAbstract<TPetStore.Client> {
  constructor(
    @inject(SharedInjectionKeys.Env) env: ServerEnv,
    @inject(SharedInjectionKeys.Logger) logger: IApiLogger
  ) {
    super(
      PetStoreDefinition,
      env.PETSTORE_URL,
      logger.getLogger(PetStoreAdapter.name)
    );
  }
}
