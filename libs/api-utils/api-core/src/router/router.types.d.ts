import type { NextApiRequest, NextApiResponse } from 'next';
import { LevelWithSilent } from 'pino';
import { z } from 'zod';
import type { IAbstractRouteImplementation } from '../route/route-abstract';
import type { TRouteInjectionKey } from '../route/route.types';

export type TRouteRecord = Record<
  TRouteInjectionKey,
  IAbstractRouteImplementation
>;

export type TOpenApiRecord = Record<
  string,
  IOpenApiAbstractImplementation<any>
>;

export type TRouterConfiguration = {
  routes: TRouteRecord;
  openApi?: TOpenApiRecord;
  env?: z.ZodTypeAny;
  auth?: IAbstractRouteImplementation;
  log?: LevelWithSilent;
  dependencies?: (container: IContainer) => void | Promise<void>;
};

export type TRouteHandlerContext = {
  request: NextApiRequest;
  response: NextApiResponse;
};

export type TRouterHandler = (context: TRouteHandlerContext) => Promise<void>;

export interface IRouter {
  handler: TRouterHandler;
}
