import { ApiContainer } from '../api-container/api-container';
import type { IApiContainer } from '../api-container/api-container.types';
import { ErrorFactory } from '../errors/error-factory';
import { RouteDiscover } from '../route-discover/route-discover';
import { IRouteDiscover } from '../route-discover/route-discover.types';
import type {
  IRouter,
  TRouteHandlerContext,
  TRouterConfiguration,
  TRouterHandler,
} from './router.types';

export class Router implements IRouter {
  #container: IApiContainer;

  constructor(private readonly config: TRouterConfiguration) {
    this.#container = new ApiContainer(config);
  }

  handler: TRouterHandler = async (request, response) => {
    try {
      await this.#initializeHandler({ request, response });
      const routeDiscover = new RouteDiscover(this.config.routes, request);
      const routeHandler = routeDiscover.execute(this.#container.current);
      await routeHandler.handler();
    } catch (error) {
      const apiError = ErrorFactory.create(error);
      response.status(apiError.statusCode).json(apiError);
    } finally {
      this.#container.current.dispose();
    }
  };

  async #initializeHandler(context: TRouteHandlerContext) {
    await this.#container.initialize();
    this.#container.addRequestContext(context);
  }
}
