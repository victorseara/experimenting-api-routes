import { AbstractApiClient } from '@self/api-core';
import { GetLaunchpadConfig } from '../launchpad-api.config';
import { TGetLaunchpadResponse } from './get-launchpad.schema';

export class GetLaunchpadClient extends AbstractApiClient<TGetLaunchpadResponse> {
  async execute() {
    const response = await this.client.get<TGetLaunchpadResponse>(
      GetLaunchpadConfig.path
    );

    return response.data.result;
  }
}
