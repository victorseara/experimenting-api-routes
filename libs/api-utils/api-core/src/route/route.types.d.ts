import { NextApiRequest, NextApiResponse } from 'next';
import { routeInjectionKeySchema } from './route.schemas';
import { z } from 'zod';

export type TRouteContext<Output = {}> = {
  request: NextApiRequest;
  response: NextApiResponse<Output>;
};

export type TRouteResponse<Output> = {
  result?: Output;
  error?: unknown;
};

export type TRouteHandler = () => void | Promise<void>;

export interface IRoute {
  handler: TRouteHandler;
}

export type TRouteMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TRouteInjectionKey = z.infer<typeof routeInjectionKeySchema>;

export interface IRouteConfiguration {
  method: TRouteMethod;
  path: `/${string}`;
  injectionKey: TRouteInjectionKey;
}
