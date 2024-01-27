import type { NextApiRequest, NextApiResponse } from 'next';
import type { LevelWithSilent } from 'pino';
import type { IAbstractRouteImplementation } from '../route/abstract-route';
import type { TRouteInjectionKey } from '../route/route.types';
import type { IServiceImplementation } from '../services/services.types';
import type { IOperationImplementation } from '../operations/operations.types';

export type TRouteRecord = Record<
  TRouteInjectionKey,
  IAbstractRouteImplementation
>;

export type TRouterConfiguration = {
  basePath?: string;
  routes: TRouteRecord;
  openApi?: IOpenApiAbstractImplementation[];
  auth?: IAbstractRouteImplementation;
  log?: LevelWithSilent;
  operations?: IOperationImplementation<any, any>[];
  services?: IServiceImplementation<any, any>[];
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
