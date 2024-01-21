import type { IRoute, TRouteContext, TRouteHandler } from './route.types';

export abstract class AbstractRoute<T = unknown> implements IRoute {
  constructor(protected context: TRouteContext<T>) {}
  abstract handler: TRouteHandler;
}

export interface IAbstractRouteImplementation {
  new (...args: any[]): AbstractRoute<any>;
}
