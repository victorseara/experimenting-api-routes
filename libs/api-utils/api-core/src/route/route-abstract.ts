import type {
  IRoute,
  TRouteContext,
  TRouteHandler,
  TRouteResponse,
} from './route.types';

export abstract class AbstractRoute<T = unknown> implements IRoute {
  constructor(protected context: TRouteContext<TRouteResponse<T>>) {}
  abstract handler: TRouteHandler;
}

export interface IAbstractRouteImplementation {
  new (...args: any[]): AbstractRoute<unknown>;
}
