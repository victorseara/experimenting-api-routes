import { AbstractRoute, TRouteHandler } from '@self/api-core';
import { CoreInjectionKeys, TRouteContext } from '@self/api-core/server';
import { inject, injectable } from 'tsyringe';
import { GetHomeDataConfig } from '../di/home-api-config';
import { TGetHomeDataResponse } from './get-home-data.schema';
import { GetHomeDataService } from './get-home-data.service';

@injectable()
export class GetHomeDataRoute extends AbstractRoute<TGetHomeDataResponse> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(CoreInjectionKeys.BasePath)
    basePath: string,
    @inject(GetHomeDataService.name) private service: GetHomeDataService
  ) {
    super(context, GetHomeDataConfig.injectionKey, basePath);
  }
  handler: TRouteHandler = async () => {
    const result = await this.service.execute();

    this.context.response.status(200).json({ result });
  };
}
