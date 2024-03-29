import { NextApiRequest, NextApiResponse } from 'next';
import nodeMocksHttp, { RequestMethod, RequestOptions } from 'node-mocks-http';

export function createMockedHttpContext(
  method: RequestMethod,
  url: string,
  request?: RequestOptions
): { req: NextApiRequest; res: NextApiResponse } {
  return nodeMocksHttp.createMocks({
    method: method,
    url: url,
    ...request,
  });
}
