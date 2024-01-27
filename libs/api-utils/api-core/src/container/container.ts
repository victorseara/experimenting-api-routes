import 'reflect-metadata';
import { DependencyContainer, container } from 'tsyringe';
import { IContainer } from './container.types';

export class Container implements IContainer {
  #injectionKeys = new Set<string>();
  #container: DependencyContainer;

  constructor() {
    this.#container = container.createChildContainer();
  }

  registerClass<T>(token: string, value: new (...args: any[]) => T): void {
    if (this.isRegistered(token)) {
      throw new Error(`Token ${token} is already registered`);
    }

    this.#injectionKeys.add(token);
    this.#container.register<T>(token, { useClass: value });
  }

  registerValue<T>(token: string, value: T): void {
    if (this.isRegistered(token)) {
      throw new Error(`Token ${token} is already registered`);
    }

    this.#injectionKeys.add(token);
    this.#container.register<T>(token, { useValue: value });
  }

  isRegistered(token?: string): token is string {
    if (!token) return false;

    const isInjected = this.#injectionKeys.has(token);

    if (!isInjected) {
      return false;
    }

    return this.#container.isRegistered(token);
  }

  resolve<T>(token: string): T {
    try {
      return this.#container.resolve<T>(token);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `${Container.name} failed to resolve ${token}: ${error.message}`
        );
      }
      throw new Error(`${Container.name}: failed to resolve ${token}`);
    }
  }

  dispose(): void {
    this.#injectionKeys.clear();
    this.#container.reset();
    this.#container.dispose();
  }
}
