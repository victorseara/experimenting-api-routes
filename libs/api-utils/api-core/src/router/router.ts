import { Container } from '../container/container';
import type { IContainer } from '../container/container.types';
import { SharedInjectionKeys } from '../injection-keys';
import { ApiLogger } from '../logger/logger';
import { IApiLogger, ILogger } from '../logger/logger.types';
import type {
  IRouter,
  TRouteHandlerContext,
  TRouterConfiguration,
  TRouterHandler,
} from './router.types';

export class Router implements IRouter {
  #container: IContainer;
  #basePath = '/api';
  #logger: ILogger;

  constructor(private readonly config: TRouterConfiguration) {
    this.#container = new Container();
    this.#logger = new ApiLogger(config.log ?? 'silent').getLogger(Router.name);
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
    this.#registerEnv();
    this.#registerAuth();
    this.#registerLogger();
    await this.#registerOpenApi();
    await this.config.dependencies?.(this.#container);
  }

  #registerRoutes() {
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      this.#container.registerClass(key, value);
    });
  }

  #registerEnv() {
    if (!this.config.env) {
      return;
    }

    this.#container.registerValue(SharedInjectionKeys.Env, this.config.env);
  }

  async #registerOpenApi() {
    if (!this.config.openApi) {
      return;
    }

    const openApi = Object.entries(this.config.openApi);

    const promises = openApi.map(([key, value]) => {
      this.#container.registerOpenApiAdapter(key, value);
    });

    await Promise.all(promises);
  }

  #registerAuth() {
    if (!this.config.auth) {
      this.#logger.debug('No auth route registered');
      return;
    }

    this.#container.registerClass(SharedInjectionKeys.Auth, this.config.auth);
  }

  #registerLogger() {
    this.#container.registerValue(
      SharedInjectionKeys.LogLevel,
      this.config.log ?? 'silent'
    );

    this.#container.registerClass<IApiLogger>(
      SharedInjectionKeys.Logger,
      ApiLogger
    );
  }

  #getRouteHandler(request: TRouteHandlerContext['request']) {
    const fullPath = request.url?.replace(this.#basePath, '');
    const method = request.method;

    if (!fullPath || !method) {
      throw Error('The request is invalid');
    }

    if (fullPath.includes('auth')) {
      return this.#container.resolve<IRouter>(SharedInjectionKeys.Auth);
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

/**
 * Create a new route
 *  -> route.method.ts
 *  -> route.schema.ts
 *  -> route.config.ts
 *  -> route.client.ts
 *  -> route.method.test.ts
 * Create a new open api adapter
 *  -> open-api.adapter.ts
 *  -> open-api.config.ts
 * Create new operation
 *  -> shared.operation.ts
 *  -> shared.operation.schema.ts
 *  -> shared.operation.config.ts
 *  -> shared.operation.test.ts
 */
