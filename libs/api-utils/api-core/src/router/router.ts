import { Container } from '../container/container';
import type { IContainer } from '../container/container.types';
import { SharedInjectionKeys } from '../injection-keys';
import type {
  IRouter,
  TRouteHandlerContext,
  TRouterConfiguration,
  TRouterHandler,
} from './router.types';

export class Router implements IRouter {
  #container: IContainer;
  #basePath = '/api';

  constructor(private readonly config: TRouterConfiguration) {
    this.#container = new Container();
  }
  handler: TRouterHandler = async (context) => {
    try {
      await this.#injectDependencies(context);
      const routeHandler = this.#getRouteHandler(context.request);
      await routeHandler.handler(context);
    } catch (error) {
      context.response.status(500).json({ error: 'Failed to execute route' });
    } finally {
      this.#container.dispose();
    }
  };

  async #injectDependencies(context: TRouteHandlerContext) {
    this.#container.registerValue(SharedInjectionKeys.RequestContext, context);
    this.#registerRoutes();
  }

  #registerRoutes() {
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      this.#container.registerClass(key, value);
    });
  }

  #getRouteHandler(request: TRouteHandlerContext['request']) {
    const fullPath = request.url?.replace(this.#basePath, '');
    const method = request.method;

    if (!fullPath || !method) {
      throw Error('The request is invalid');
    }

    const requestKey = `${method} ${fullPath}`;

    if (this.#container.isRegistered(requestKey)) {
      return this.#container.resolve<IRouter>(requestKey);
    }

    const pathWithoutQuery = fullPath.split('?')[0];
    const pathParams = pathWithoutQuery.split('/').filter(Boolean);

    const routeKeys = Object.keys(this.config.routes);

    const routeKey = routeKeys.find((key) => {
      const keyParts = key.split(' ')[1].split('/').filter(Boolean);

      if (keyParts.length !== pathParams.length) {
        return false;
      }

      return keyParts.every((part, index) => {
        return part.startsWith(':') || part === pathParams[index];
      });
    });

    if (!this.#container.isRegistered(routeKey)) {
      throw Error('Route not registered');
    }

    return this.#container.resolve<IRouter>(routeKey);
  }
}
