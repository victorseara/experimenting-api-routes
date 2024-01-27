import { TService } from '@self/api-core';
import { TGetHomeDataResponse } from './get-home-data.schema';
import { injectable } from 'tsyringe';

@injectable()
export class GetHomeDataService
  implements TService<undefined, TGetHomeDataResponse>
{
  execute() {
    return Promise.resolve({
      message: 'Hello, world!',
    });
  }
}
