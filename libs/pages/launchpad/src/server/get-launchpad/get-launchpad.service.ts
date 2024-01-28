import { TService } from '@self/api-core';
import { TGetLaunchpadResponse } from './get-launchpad.schema';
import { injectable } from 'tsyringe';

@injectable()
export class GetLaunchpadService
  implements TService<undefined, TGetLaunchpadResponse>
{
  execute() {
    return Promise.resolve({
      message: 'Hello, world!',
    });
  }
}
