import { Router } from '@self/api-core/server';
import { InjectionKeys } from '@self/api/server';
import { PetStoreAdapter } from '@self/open-api';
import {
  listAvailablePetsConfig,
  ListAvailablePets,
} from '@self/home-page/server';

const apiRouter = new Router({
  log: 'debug',
  routes: {
    [listAvailablePetsConfig.injectionKey]: ListAvailablePets,
  },
  openApi: {
    [InjectionKeys.PetStoreAdapter]: PetStoreAdapter,
  },
});

export default apiRouter.handler;
