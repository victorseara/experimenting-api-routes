import type { IContainer } from '../container/container.types';
import { InternalServerError } from '../errors/api-errors';
import { CoreInjectionKeys } from '../core-injection-keys';
import type { IRoute } from '../route/route.types';
import type {
  TRouteHandlerContext,
  TRouterConfiguration,
} from '../router/router.types';
import type { IRouteDiscover } from './route-discover.types';

export class RouteDiscover implements IRouteDiscover {
  constructor(
    private readonly config: TRouterConfiguration['routes'],
    private readonly request: TRouteHandlerContext['request']
  ) {}

  execute(container: IContainer) {
    const requestedPath = this.request.url;
    const method = this.request.method;

    if (!requestedPath || !method) {
      throw new InternalServerError('Invalid request');
    }

    const routeType = this.#getRouteType(requestedPath, method, container);

    if (routeType === 'auth') {
      return container.resolve<IRoute>(CoreInjectionKeys.Auth);
    }

    if (routeType === 'plain') {
      return container.resolve<IRoute>(`${method} ${requestedPath}`);
    }

    const injectionKey = this.#getInjectionKey(
      requestedPath,
      Object.keys(this.config.routes)
    );

    if (!container.isRegistered(injectionKey)) {
      throw new InternalServerError(`Route not registered: ${injectionKey}`);
    }

    return container.resolve<IRoute>(injectionKey);
  }

  #getRouteType(
    requestedPath: string,
    method: string,
    container: IContainer
  ): 'plain' | 'withParams' | 'auth' {
    if (requestedPath.includes('auth')) {
      return 'auth';
    }

    if (container.isRegistered(`${method} ${requestedPath}`)) {
      return 'plain';
    }

    return 'withParams';
  }

  #getInjectionKey(requestedPath: string, routeKeys: string[]) {
    const pathWithoutQuery = requestedPath.split('?')[0];
    const pathParams = pathWithoutQuery.split('/').filter(Boolean);

    const routeKey = routeKeys.find((key) => {
      const keyParts = key.split(' ')[1].split('/').filter(Boolean);

      if (keyParts.length !== pathParams.length) {
        return false;
      }

      return keyParts.every((part, index) => {
        return part.startsWith(':') || part === pathParams[index];
      });
    });

    return routeKey;
  }
}
