import { BaseRoute, TRouteContext, TRouteHandler } from '@self/api-core';
import { CoreInjectionKeys } from '@self/api-core/server';
import { PetStoreAdapter } from '@self/open-api';
import { inject, injectable } from 'tsyringe';
import { GetPetByIdConfig } from './get-pet-by-id.config';
import {
  GetPetByIdParams,
  GetPetByIdResponse,
  paramsSchema,
} from './get-pet-by-id.schema';

@injectable()
export class GetPetByIdRoute extends BaseRoute<GetPetByIdResponse> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(CoreInjectionKeys.BasePath)
    basePath: string,
    @inject(PetStoreAdapter.name)
    private petStoreAdapter: PetStoreAdapter
  ) {
    super(context, GetPetByIdConfig.injectionKey, basePath);
  }
  handler: TRouteHandler = async () => {
    const { id } = this.parseParams<GetPetByIdParams>(paramsSchema);
    const petStoreClient = await this.petStoreAdapter.getClient();

    const response = await petStoreClient.getPetById({ petId: id });

    const result: GetPetByIdResponse = {
      id: response.data.id,
      category: response.data.category,
      name: response.data.name,
      images: response.data.photoUrls,
      status: response.data.status,
    };

    this.context.response.status(200).json({ result });
  };
}
