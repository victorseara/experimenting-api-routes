import { ApiContainer } from '../api-container/api-container';
import type { IApiContainer } from '../api-container/api-container.types';
import { ErrorFactory } from '../errors/error-factory';
import { RouteDiscover } from '../route-discover/route-discover';
import { ILogger } from '../logger/logger.types';
import type {
  IRouter,
  TRouteHandlerContext,
  TRouterConfiguration,
  TRouterHandler,
} from './router.types';
import { ApiLogger } from '../server';

export class Router implements IRouter {
  #container: IApiContainer;
  #logger: ILogger;

  constructor(private readonly config: TRouterConfiguration) {
    this.#container = new ApiContainer(config);
    this.#logger = new ApiLogger(this.config.log).getLogger(Router.name);
  }

  handler: TRouterHandler = async (request, response) => {
    try {
      this.#initializeHandler({ request, response });
      const routeDiscover = new RouteDiscover(this.config.routes, request);
      const routeHandler = routeDiscover.execute(this.#container.current);
      await routeHandler.handler();
    } catch (error) {
      const apiError = ErrorFactory.create(error);
      this.#logger.error(apiError.toJSON(), this.#getLogMessage(request));
      response.status(apiError.statusCode).json(apiError);
    } finally {
      this.#logger.info(
        this.#formatLog({ request, response }),
        this.#getLogMessage(request)
      );

      this.#container.dispose();
    }
  };

  #initializeHandler(context: TRouteHandlerContext) {
    this.#container.initialize();
    this.#container.addRequestContext(context);
  }

  #getLogMessage(request: TRouteHandlerContext['request']) {
    return `[HTTP Response]: ${request?.method?.toUpperCase()} ${request.url}`;
  }

  #formatLog(context: TRouteHandlerContext) {
    return {
      status: context.response.statusCode,
      request: {
        method: context.request?.method?.toUpperCase(),
        url: context.request.url,
        params: context.request.query,
      },
    };
  }
}
