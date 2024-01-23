import { Router } from '@self/api-core/server';
import { InjectionKeys } from '@self/api/server';
import {
  ListAvailablePets,
  ListAvailablePetsConfig,
} from '@self/home-page/server';
import { PetStoreAdapter } from '@self/open-api';
import { GetPetByIdConfig, GetPetByIdRoute } from '@self/pet-page/server';

const apiRouter = new Router({
  log: 'info',
  routes: {
    [ListAvailablePetsConfig.injectionKey]: ListAvailablePets,
    [GetPetByIdConfig.injectionKey]: GetPetByIdRoute,
  },
  openApi: {
    [InjectionKeys.PetStoreAdapter]: PetStoreAdapter,
  },
});

export default apiRouter.handler;
