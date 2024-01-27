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

  initialize() {
    this.#container = new Container();
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      this.#container?.registerClass(key, value);
    });

    this.#container.registerValue(
      CoreInjectionKeys.BasePath,
      this.config.basePath ?? '/api'
    );
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
      this.config.openApi.forEach((adapter) =>
        this.#container?.registerClass(adapter.name, adapter)
      );
    }

    if (this.config.dependencies) {
      this.config.dependencies(this);
    }
  }

  addRequestContext(context: TRouteHandlerContext) {
    this.#container?.registerValue(CoreInjectionKeys.RequestContext, context);
  }

  dispose() {
    this.#container?.dispose();
  }
}
