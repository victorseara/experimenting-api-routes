import { AbstractApiClient } from '@self/api-core';
import { GetPetByIdConfig } from './get-pet-by-id.config';
import { GetPetByIdParams, GetPetByIdResponse } from './get-pet-by-id.schema';

export class GetPetByIdClient extends AbstractApiClient<
  GetPetByIdParams,
  GetPetByIdResponse
> {
  async execute(input: GetPetByIdParams) {
    const response = await this.client.get<GetPetByIdResponse>(
      `${GetPetByIdConfig.path}/${input.id}`
    );

    return response.data.result;
  }
}
