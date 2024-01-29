import { AbstractRoute, TRouteHandler } from '@self/api-core';
import { CoreInjectionKeys, TRouteContext } from '@self/api-core/server';
import { inject, injectable } from 'tsyringe';
import { GetCompanySettingsConfig } from '../company-settings-api.config';
import { TGetCompanySettingsResponse } from './get-company-settings.schema';
import { GetCompanySettingsService } from './get-company-settings.service';

@injectable()
export class GetCompanySettingsRoute extends AbstractRoute<TGetCompanySettingsResponse> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext)
    context: TRouteContext,
    @inject(CoreInjectionKeys.BasePath)
    basePath: string,
    @inject(GetCompanySettingsService.name)
    private service: GetCompanySettingsService
  ) {
    super(context, GetCompanySettingsConfig.injectionKey, basePath);
  }
  handler: TRouteHandler = async () => {
    const result = await this.service.execute();
    this.context.response.status(400).json({ result });
  };
}
