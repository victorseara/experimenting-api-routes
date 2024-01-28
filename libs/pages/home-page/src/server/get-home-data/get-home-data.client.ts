import { AbstractApiClient } from '@self/api-core';
import { TGetHomeDataResponse } from './get-home-data.schema';
import { GetHomeDataConfig } from '../config/home-api-config';

export class GetHomeDataClient extends AbstractApiClient<TGetHomeDataResponse> {
  async execute() {
    const response = await this.client.get<TGetHomeDataResponse>(
      GetHomeDataConfig.path
    );

    return response.data.result;
  }
}
