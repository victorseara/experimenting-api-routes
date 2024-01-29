import { Router } from '@self/api-core/server';
import {
  GetHomeDataConfig,
  GetHomeDataRoute,
  GetHomeDataService,
} from '@self/home-page-final/server';
import {
  GetLaunchpadConfig,
  GetLaunchpadRoute,
  GetLaunchpadService,
} from '@self/pages/launchpad/server';
import { PetStoreAdapter } from '@self/open-api';
import {
  GetCompanySettingsConfig,
  GetCompanySettingsRoute,
  GetCompanySettingsService,
} from '@self/pages/company-settings/server';
const apiRouter = new Router({
  log: 'info',
  routes: {
    [GetHomeDataConfig.injectionKey]: GetHomeDataRoute,
    [GetLaunchpadConfig.injectionKey]: GetLaunchpadRoute,
    [GetCompanySettingsConfig.injectionKey]: GetCompanySettingsRoute,
  },
  services: [
    GetHomeDataService,
    GetLaunchpadService,
    GetCompanySettingsService,
  ],
  openApi: [PetStoreAdapter],
  operations: [GetHomeDataService],
});
export default apiRouter.handler;
