import {
  AbstractRoute,
  IOpenApiAbstractImplementation,
  SharedInjectionKeys,
  TRouteContext,
  TRouteHandler,
} from '@self/api-core/server';
import { ListAvailablePetsResponse } from './list-available-pets.schema';
import { inject, injectable } from 'tsyringe';
import { InjectionKeys } from '@self/api/server';
import { TPetStore } from '@self/open-api';

@injectable()
export class ListAvailablePets extends AbstractRoute<ListAvailablePetsResponse> {
  constructor(
    @inject(SharedInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(InjectionKeys.PetStoreAdapter)
    private petStoreAdapter: IOpenApiAbstractImplementation<TPetStore.Client>
  ) {
    super(context);
  }

  handler: TRouteHandler = async () => {
    const petStoreClient = await this.petStoreAdapter.getClient();

    /* @ts-ignore */
    const response = await petStoreClient.findPetsByStatus({
      status: 'available',
    });

    const pets: ListAvailablePetsResponse = response.data.map((pet) => ({
      id: pet.id,
      name: pet.name,
      status: pet.status,
      images: pet.photoUrls,
      category: pet.category,
    }));

    this.context.response.status(200).json({ result: pets });
  };
}
