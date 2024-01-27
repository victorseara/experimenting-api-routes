import { IContainer } from '../container/container.types';

export interface IApiContainer {
  initialize(): void;
  addRequestContext(context: TRouteHandlerContext): void;
  current: IContainer;
  dispose(): void;
}
