import { TService } from '@self/api-core';
import { TGetCompanySettingsResponse } from './get-company-settings.schema';
import { injectable } from 'tsyringe';

@injectable()
export class GetCompanySettingsService
  implements TService<undefined, TGetCompanySettingsResponse>
{
  execute() {
    return Promise.resolve({
      message: 'Hello, world!',
    });
  }
}
