import { NextApiRequest, NextApiResponse } from 'next';

class RouteError extends Error {}

type TRouteContext<Output> = {
  request: NextApiRequest;
  response: NextApiResponse<Output>;
};

type TRouteResponse<Output> = {
  result?: Output;
  error?: RouteError;
};

interface IRoute {
  handle(): Promise<void>;
}

abstract class Route<T = unknown> implements IRoute {
  constructor(protected context: TRouteContext<TRouteResponse<T>>) {}

  handle(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

type GetGreetingInput = { name: string };
type GetGreetingOutput = string;
type GetGreetingResponse = TRouteResponse<GetGreetingOutput>;

class GetGreetingRoute extends Route<GetGreetingOutput> {
  static path = '/api/greeting';

  async handle() {
    this.context.response.json({
      result: `Hello ${this.context.request.query.name}`,
    });
  }
}

interface TClient<T, U> {
  execute: (params: T) => Promise<U>;
}

interface TClientWithoutParams<U> {
  execute: () => Promise<U>;
}

class GetGreetingClient
  implements TClient<GetGreetingInput, GetGreetingOutput>
{
  async execute(params: GetGreetingInput) {
    const response = await fetch(
      `${GetGreetingRoute.path}?name=${params.name}`
    );

    const data = (await response.json()) as GetGreetingResponse;

    if (!data.result) throw new Error('No result');

    return data.result;
  }
}

interface IOperation<T> {
  execute: () => Promise<T | RouteError>;
}



export default api.handler;
