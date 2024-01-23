import { z } from 'zod';
import { BadRequestError, InternalServerError } from '../errors/api-errors';
import type {
  IRoute,
  TRouteContext,
  TRouteHandler,
  TRouteInjectionKey,
  TRouteResponse,
} from './route.types';

export abstract class AbstractRoute<T = unknown> implements IRoute {
  readonly #queryParamsSchema = z.array(z.string());

  constructor(
    protected context: TRouteContext<TRouteResponse<T>>,
    private readonly injectionKey: TRouteInjectionKey,
    private readonly basePath = '/api'
  ) {}
  abstract handler: TRouteHandler;

  protected parseBody<Body>(schema: z.ZodTypeAny): Body {
    const result = schema.safeParse(this.context.request.body);

    if (!result.success) {
      throw new BadRequestError(
        `Invalid request body`,
        result.error.flatten().fieldErrors
      );
    }

    return result.data;
  }

  protected parseParams<Params>(schema: z.ZodTypeAny): Params {
    const queryWithBase = Object.entries(this.context.request.query)[0][1];
    const query = this.#queryParamsSchema.safeParse(queryWithBase);

    if (!query.success) {
      throw new BadRequestError(
        `Invalid request query`,
        query.error.flatten().fieldErrors
      );
    }

    const requestParams = this.#getParamsValue(query.data);
    const result = schema.safeParse(requestParams);

    if (!result.success) {
      throw new BadRequestError(
        `Invalid request params`,
        result.error.flatten().fieldErrors
      );
    }

    return result.data;
  }

  protected parseQuery<Query>(schema: z.ZodTypeAny): Query {
    const result = schema.safeParse(this.context.request.query);

    if (!result.success) {
      throw new BadRequestError(
        `Invalid request query`,
        result.error.flatten().fieldErrors
      );
    }

    return result.data;
  }

  #getParamsValue = (params: string[]) => {
    const { paramName, paramPosition } = this.#getParamsMeta(this.injectionKey);

    const param = { [paramName]: params[paramPosition] };
    return param;
  };

  #getParamsMeta(requestPath: string) {
    const pathWithoutBase = requestPath.replace(this.basePath, '');
    const splittedPath = pathWithoutBase.split('/');

    const paramPosition = splittedPath.findIndex((item) =>
      item.startsWith(':')
    );

    if (paramPosition === -1) {
      throw new InternalServerError(
        'Request target is invalid, no params found'
      );
    }

    const paramName = splittedPath[paramPosition].replace(':', '');

    return { paramPosition: paramPosition - 1, paramName };
  }
}

export interface IAbstractRouteImplementation {
  new (...args: any[]): AbstractRoute<any>;
}
