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

const apiRouter = new Router({
  log: 'info',
  routes: {
    [GetHomeDataConfig.injectionKey]: GetHomeDataRoute,
    [GetLaunchpadConfig.injectionKey]: GetLaunchpadRoute,
  },
  services: [GetHomeDataService, GetLaunchpadService],
});

export default apiRouter.handler;
