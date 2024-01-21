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
      this.#logger.info(context, '[Start] handler execution');
      await this.#injectDependencies(context);
      const routeHandler = this.#getRouteHandler(context.request);
      await routeHandler.handler(context);
    } catch (error) {
      context.response.status(500).json({ error: 'Failed to execute route' });
    } finally {
      this.#logger.info(context, '[End] handler execution]');
      this.#container.dispose();
    }
  };

  async #injectDependencies(context: TRouteHandlerContext) {
    this.#logger.debug('[Start] registering dependencies');
    this.#container.registerValue(SharedInjectionKeys.RequestContext, context);
    this.#registerRoutes();
    this.#registerEnv();
    this.#registerAuth();
    this.#registerLogger();
    await this.#registerOpenApi();
    this.#logger.debug('Registering dependencies');
  }

  #registerRoutes() {
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      this.#logger.debug(key, 'Registered route');
      this.#container.registerClass(key, value);
    });
  }

  #registerEnv() {
    if (!this.config.env) {
      this.#logger.debug('No env registered');
      return;
    }

    this.#container.registerValue(SharedInjectionKeys.Env, this.config.env);
    this.#logger.debug(this.config.env, 'Registered env');
  }

  async #registerOpenApi() {
    if (!this.config.openApi) {
      this.#logger.debug(this.config.env, 'No OpenApi Adapters registered');
      return;
    }

    const openApi = Object.entries(this.config.openApi);

    const promises = openApi.map(([key, value]) => {
      this.#container.registerOpenApiAdapter(key, value);
      this.#logger.debug(key, 'OpenApi Adapter registered');
    });

    await Promise.all(promises);
  }

  #registerAuth() {
    if (!this.config.auth) {
      this.#logger.debug('No auth route registered');
      return;
    }

    this.#container.registerClass(SharedInjectionKeys.Auth, this.config.auth);
    this.#logger.debug(SharedInjectionKeys.Auth, 'Auth route registered');
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

    this.#logger.debug(SharedInjectionKeys.Logger, 'Logger registered');
  }

  #getRouteHandler(request: TRouteHandlerContext['request']) {
    const fullPath = request.url?.replace(this.#basePath, '');
    const method = request.method;

    if (!fullPath || !method) {
      this.#logger.debug({ fullPath, method }, 'Invalid request');
      throw Error('The request is invalid');
    }

    if (fullPath.includes('auth')) {
      return this.#container.resolve<IRouter>(SharedInjectionKeys.Auth);
    }

    const requestKey = `${method} ${fullPath}`;

    if (this.#container.isRegistered(requestKey)) {
      this.#logger.debug(requestKey, 'Route detected');
      return this.#container.resolve<IRouter>(requestKey);
    }

    const pathWithoutQuery = fullPath.split('?')[0];
    const pathParams = pathWithoutQuery.split('/').filter(Boolean);

    const routeKeys = Object.keys(this.config.routes);

    this.#logger.debug(pathParams, 'Searching route');

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
      this.#logger.debug(routeKey, 'Route not registered');
      throw Error('Route not registered');
    }

    this.#logger.debug(routeKey, 'Route detected');
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
