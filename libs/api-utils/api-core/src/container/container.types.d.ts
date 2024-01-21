export interface IContainer {
  registerClass<T>(token: string, value: new (...args: any[]) => T): void;
  registerValue<T>(token: string, value: T): void;
  registerOpenApiAdapter<T>(
    token: string,
    value: IOpenApiAbstractImplementation<T>
  ): Promise<void>;
  isRegistered(token?: string): token is string;
  resolve<T>(token: string): T;
  dispose(): void;
}
