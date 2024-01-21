import { OpenApiAbstract, SharedInjectionKeys } from '@self/api-core/server';
import PetStoreDefinition from '../definitions/swagger-pet-store.json';
import * as TPetStore from '../types/swagger-pet-store';
import { inject, injectable } from 'tsyringe';

type ServerEnv = {
  PETSTORE_URL: string;
};

@injectable()
export class PetStoreAdapter extends OpenApiAbstract<TPetStore.Client> {
  constructor(@inject(SharedInjectionKeys.Env) env: ServerEnv) {
    super(PetStoreDefinition, env.PETSTORE_URL);
  }
}
