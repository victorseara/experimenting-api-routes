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
    const container = new Container();
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      container.registerClass(key, value);
    });

    container.registerValue(
      CoreInjectionKeys.BasePath,
      this.config.basePath ?? '/api'
    );

    container.registerValue(CoreInjectionKeys.Env, process.env);

    if (this.config.auth) {
      container.registerClass(CoreInjectionKeys.Auth, this.config.auth);
    }

    container.registerValue(
      CoreInjectionKeys.LogLevel,
      this.config.log ?? 'silent'
    );

    container.registerClass<IApiLogger>(CoreInjectionKeys.Logger, ApiLogger);

    if (this.config.openApi) {
      this.config.openApi.forEach((adapter) =>
        container.registerClass(adapter.name, adapter)
      );
    }

    if (this.config.operations) {
      this.config.operations.forEach((operation) => {
        container.registerClass(operation.name, operation);
      });
    }

    if (this.config.services) {
      this.config.services.forEach((service) => {
        container.registerClass(service.name, service);
      });
    }

    if (this.config.dependencies) {
      this.config.dependencies(container);
    }

    this.#container = container;
  }

  addRequestContext(context: TRouteHandlerContext) {
    this.#container?.registerValue(CoreInjectionKeys.RequestContext, context);
  }

  dispose() {
    this.#container?.dispose();
  }
}
