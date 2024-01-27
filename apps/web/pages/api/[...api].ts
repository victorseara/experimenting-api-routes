import { Router } from '@self/api-core/server';
import {
  GetHomeDataConfig,
  GetHomeDataRoute,
  GetHomeDataService,
} from '@self/home-page-final/server';

const apiRouter = new Router({
  log: 'info',
  routes: {
    [GetHomeDataConfig.injectionKey]: GetHomeDataRoute,
  },
  services: [GetHomeDataService],
});

export default apiRouter.handler;
