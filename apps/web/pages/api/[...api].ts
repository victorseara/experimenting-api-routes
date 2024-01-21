import { Router } from '@self/api-core/server';
import { InjectionKeys } from '@self/api/server';
import { PetStoreAdapter } from '@self/open-api';
import {
  ListAvailablePetsConfig,
  ListAvailablePets,
} from '@self/home-page/server';

const apiRouter = new Router({
  log: 'info',
  routes: {
    [ListAvailablePetsConfig.injectionKey]: ListAvailablePets,
  },
  openApi: {
    [InjectionKeys.PetStoreAdapter]: PetStoreAdapter,
  },
});

export default apiRouter.handler;
