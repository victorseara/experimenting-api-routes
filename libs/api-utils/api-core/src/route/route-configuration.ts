import { routeInjectionKeySchema } from './route.schemas';
import type {
  IRouteConfiguration,
  TRouteInjectionKey,
  TRouteMethod,
} from './route.types';

export class RouteConfiguration implements IRouteConfiguration {
  constructor(public method: TRouteMethod, public path: `/api/${string}`) {}

  get injectionKey() {
    const injectionKey = `${this.method} ${this.path}`;
    if (this.#isInjectionKey(injectionKey)) {
      return injectionKey;
    }
    throw new Error(`Invalid injection key: ${injectionKey}`);
  }

  #isInjectionKey(key: string): key is TRouteInjectionKey {
    const result = routeInjectionKeySchema.safeParse(key);

    if (result.success) {
      return true;
    }
    return false;
  }
}
