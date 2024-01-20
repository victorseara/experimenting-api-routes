export interface IContainer {
  registerClass<T>(token: string, value: new (...args: unknown[]) => T): void;
  registerValue<T>(token: string, value: T): void;
  isRegistered(token: string): boolean;
  resolve<T>(token: string): T;
  dispose(): void;
}
