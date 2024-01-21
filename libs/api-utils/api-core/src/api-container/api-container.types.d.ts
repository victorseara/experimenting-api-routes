import { IContainer } from '../container/container.types';

export interface IApiContainer {
  initialize(): Promise<void>;
  addRequestContext(context: TRouteHandlerContext): void;
  current: IContainer;
}
