import { Container } from '../container/container';
import type { IContainer } from '../container/container.types';
import type {
  IRouter,
  TRouterConfiguration,
  TRouterHandler,
} from './router.types';

export class Router implements IRouter {
  #container: IContainer;

  constructor(private readonly config: TRouterConfiguration) {
    this.#container = new Container();
  }
  handler: TRouterHandler = async (context) => {
    await this.#injectDependencies();

    return Promise.resolve();
  };

  async #injectDependencies() {
    const routes = Object.entries(this.config.routes);

    routes.forEach(([key, value]) => {
      this.#container.registerClass(key, value);
    });
  }
}
