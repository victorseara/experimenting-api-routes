import { AbstractApiClient } from '@self/api-core';
import { GetCompanySettingsConfig } from '../company-settings-api.config';
import { TGetCompanySettingsResponse } from './get-company-settings.schema';

export class GetCompanySettingsClient extends AbstractApiClient<TGetCompanySettingsResponse> {
  async execute() {
    const response = await this.client.get<TGetCompanySettingsResponse>(
      GetCompanySettingsConfig.path
    );

    return response.data.result;
  }
}
