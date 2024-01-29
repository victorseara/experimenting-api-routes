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


const apiRouter = new Router({
  log: 'info',
  routes: {
    [GetHomeDataConfig.injectionKey]: GetHomeDataRoute,
    [GetLaunchpadConfig.injectionKey]: GetLaunchpadRoute,
  },
  services: [GetHomeDataService, GetLaunchpadService],
  openApi: [PetStoreAdapter],
});

export default apiRouter.handler;
