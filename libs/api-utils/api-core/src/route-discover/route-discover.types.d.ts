import { IContainer } from '../container/container.types';

export interface IRouteDiscover {
  execute(container: IContainer): IRoute;
}
