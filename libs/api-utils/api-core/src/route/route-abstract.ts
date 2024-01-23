import { z } from 'zod';
import { BadRequestError, InternalServerError } from '../errors/api-errors';
import type {
  IRoute,
  TRouteContext,
  TRouteHandler,
  TRouteInjectionKey,
  TRouteResponse,
} from './route.types';

const baseParamSchema = z.object({
  api: z.array(z.string()),
});

type TBaseParamSchema = z.infer<typeof baseParamSchema>;

export abstract class AbstractRoute<T = unknown> implements IRoute {
  readonly #baseParamSchema = baseParamSchema;

  constructor(
    protected context: TRouteContext<TRouteResponse<T>>,
    private readonly injectionKey: TRouteInjectionKey
  ) {}
  abstract handler: TRouteHandler;

  protected parseBody<Body>(schema: z.ZodType<Body>): Body {
    const result = schema.safeParse(this.context.request.body);

    if (!result.success) {
      throw new BadRequestError(
        `Invalid request body`,
        result.error.flatten().fieldErrors
      );
    }

    return result.data;
  }

  protected parseParams<Params>(schema: z.ZodType<Params>): Params {
    const baseParamsResult = this.#baseParamSchema.safeParse(
      this.context.request.query
    );

    if (!baseParamsResult.success) {
      throw new InternalServerError(
        'API router is misconfigured. API handler should be configured under /api path',
        baseParamsResult.error.flatten().fieldErrors
      );
    }

    const requestParams = this.#getParamsValue(baseParamsResult.data);
    const result = schema.safeParse(requestParams);

    if (!result.success) {
      throw new BadRequestError(
        `Invalid request params`,
        result.error.flatten().fieldErrors
      );
    }

    return result.data;
  }

  protected parseQuery<Query>(schema: z.ZodType<Query>): Query {
    const result = schema.safeParse(this.context.request.query);

    if (!result.success) {
      throw new BadRequestError(
        `Invalid request query`,
        result.error.flatten().fieldErrors
      );
    }

    return result.data;
  }

  #getParamsValue = (params: TBaseParamSchema) => {
    const { paramName, paramPosition } = this.#getParamsMeta(this.injectionKey);

    const param = { [paramName]: params.api[paramPosition] };
    return param;
  };

  #getParamsMeta(requestPath: string) {
    const splittedPath = requestPath.split('/').filter(Boolean).slice(1);

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
