import { Container } from '../container/container';
import { IContainer } from '../container/container.types';
import { CoreInjectionKeys } from '../core-injection-keys';
import { ApiLogger } from '../logger/logger';
import type { IApiLogger } from '../logger/logger.types';
import type {
  TRouteHandlerContext,
  TRouterConfiguration,
} from '../router/router.types';
import { InternalServerError } from '../server';
import { IApiContainer } from './api-container.types';

export class ApiContainer implements IApiContainer {
  #container: IContainer | null = null;
  constructor(private readonly config: TRouterConfiguration) {}

  get current() {
    if (!this.#container)
      throw new InternalServerError('Container not initialized');
    return this.#container;
  }

  async initialize() {
    this.#container = new Container();
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      this.#container?.registerClass(key, value);
    });

    this.#container?.registerValue(CoreInjectionKeys.Env, process.env);

    if (this.config.auth) {
      this.#container?.registerClass(CoreInjectionKeys.Auth, this.config.auth);
    }

    this.#container?.registerValue(
      CoreInjectionKeys.LogLevel,
      this.config.log ?? 'silent'
    );

    this.#container?.registerClass<IApiLogger>(
      CoreInjectionKeys.Logger,
      ApiLogger
    );

    if (this.config.openApi) {
      const openApi = Object.entries(this.config.openApi);

      openApi.forEach(([key, value]) =>
        this.#container?.registerOpenApiAdapter(key, value)
      );
    }

    if (this.config.dependencies) {
      await this.config.dependencies(this);
    }
  }

  addRequestContext(context: TRouteHandlerContext) {
    this.#container?.registerValue(CoreInjectionKeys.RequestContext, context);
  }
}
