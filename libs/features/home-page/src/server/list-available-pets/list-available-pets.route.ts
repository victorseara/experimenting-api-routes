import {
  AbstractRoute,
  CoreInjectionKeys,
  IOpenApiAbstractImplementation,
  TRouteContext,
  TRouteHandler,
} from '@self/api-core/server';
import { InjectionKeys } from '@self/api/server';
import { PetStoreAdapter, TPetStore } from '@self/open-api';
import { inject, injectable } from 'tsyringe';
import { ListAvailablePetsConfig } from './list-available-pets.config';
import { AvailablePetsResponse } from './list-available-pets.schema';

export interface IMyOperation {
  execute(): void;
}

@injectable()
export class ListAvailablePets extends AbstractRoute<AvailablePetsResponse> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(CoreInjectionKeys.BasePath)
    basePath: string,
    @inject(PetStoreAdapter.name)
    private petStoreAdapter: PetStoreAdapter
  ) {
    super(context, ListAvailablePetsConfig.injectionKey, basePath);
  }

  handler: TRouteHandler = async () => {
    const petStoreClient = await this.petStoreAdapter.getClient();

    /* @ts-ignore */
    const response = await petStoreClient.findPetsByStatus({
      status: 'available',
    });

    const pets: AvailablePetsResponse = response.data.map((pet) => ({
      id: pet.id,
      name: pet.name,
      status: pet.status,
      images: pet.photoUrls,
      category: pet.category,
    }));

    this.context.response.status(200).json({ result: pets });
  };
}
