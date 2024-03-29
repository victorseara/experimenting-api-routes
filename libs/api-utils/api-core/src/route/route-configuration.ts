import { InternalServerError } from '../errors/api-errors';
import { routeInjectionKeySchema } from './route.schemas';
import type {
  IRouteConfiguration,
  TRouteInjectionKey,
  TRouteMethod,
} from './route.types';

export class RouteConfiguration implements IRouteConfiguration {
  #path: string;

  constructor(public method: TRouteMethod, path: `/${string}`) {
    this.#path = path;
  }

  get path() {
    return this.#path.replace(/\/:[^/]+/g, '');
  }

  get injectionKey(): TRouteInjectionKey {
    const injectionKey = `${this.method} ${this.#path}`;

    if (this.#isInjectionKey(injectionKey)) {
      return injectionKey;
    }

    throw new InternalServerError(`Invalid injection key: ${injectionKey}`);
  }

  #isInjectionKey(key: string): key is TRouteInjectionKey {
    const result = routeInjectionKeySchema.safeParse(key);

    if (result.success) {
      return true;
    }
    return false;
  }
}
