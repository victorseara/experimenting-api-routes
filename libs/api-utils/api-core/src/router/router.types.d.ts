import type { NextApiRequest, NextApiResponse } from 'next';
import { LevelWithSilent } from 'pino';
import type { IAbstractRouteImplementation } from '../route/abstract-route';
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
  basePath?: string;
  routes: TRouteRecord;
  openApi?: TOpenApiRecord;
  auth?: IAbstractRouteImplementation;
  log?: LevelWithSilent;
  dependencies?: (container: IContainer) => void | Promise<void>;
};

export type TRouteHandlerContext = {
  request: NextApiRequest;
  response: NextApiResponse;
};

export type TRouterHandler = (
  request: NextApiRequest,
  response: NextApiResponse
) => Promise<void>;

export interface IRouter {
  handler: TRouterHandler;
}
