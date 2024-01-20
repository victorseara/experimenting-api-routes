import type { NextApiRequest, NextApiResponse } from 'next';
import type { IAbstractRouteImplementation } from '../route/route.abstract';
import type { TRouteInjectionKey } from '../route/route.types';

export type TRouteRecord = Record<
  TRouteInjectionKey,
  IAbstractRouteImplementation
>;

export type TRouterConfiguration = {
  routes: TRouteRecord;
};

export type TRouterHandlerArgs = {
  request: NextApiRequest;
  response: NextApiResponse;
};

export type TRouterHandler = (context: TRouterHandlerArgs) => Promise<void>;

export interface IRouter {
  handler: TRouterHandler;
}
