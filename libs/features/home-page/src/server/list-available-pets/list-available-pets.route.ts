import {
  AbstractRoute,
  CoreInjectionKeys,
  IOpenApiAbstractImplementation,
  TRouteContext,
  TRouteHandler,
} from '@self/api-core/server';
import { InjectionKeys } from '@self/api/server';
import { TPetStore } from '@self/open-api';
import { inject, injectable } from 'tsyringe';
import { AvailablePetsResponse } from './list-available-pets.schema';
import { ListAvailablePetsConfig } from './list-available-pets.config';

export interface IMyOperation {
  execute(): void;
}

@injectable()
export class ListAvailablePets extends AbstractRoute<AvailablePetsResponse> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(InjectionKeys.PetStoreAdapter)
    private petStoreAdapter: IOpenApiAbstractImplementation<TPetStore.Client>,
    @inject(InjectionKeys.MyCustomOperation) private readonly myOperation: IMyOperation
  ) {
    super(context, ListAvailablePetsConfig.injectionKey);
  }

  handler: TRouteHandler = async () => {
    const auth = this.myOperation.execute();
    
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
