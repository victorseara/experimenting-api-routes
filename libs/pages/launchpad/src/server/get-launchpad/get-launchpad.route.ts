import { AbstractRoute, TRouteHandler } from '@self/api-core';
import { CoreInjectionKeys, TRouteContext } from '@self/api-core/server';
import { inject, injectable } from 'tsyringe';
import { GetLaunchpadConfig } from '../launchpad-api.config';
import { TGetLaunchpadResponse } from './get-launchpad.schema';
import { GetLaunchpadService } from './get-launchpad.service';

@injectable()
export class GetLaunchpadRoute extends AbstractRoute<TGetLaunchpadResponse> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(CoreInjectionKeys.BasePath)
    basePath: string,
    @inject(GetLaunchpadService.name) private service: GetLaunchpadService
  ) {
    super(context, GetLaunchpadConfig.injectionKey, basePath);
  }
  handler: TRouteHandler = async () => {
    const result = await this.service.execute();
    this.context.response.status(200).json({ result });
  };
}
