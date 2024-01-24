import { NextApiRequest, NextApiResponse } from 'next';
import nodeMocksHttp, { RequestMethod } from 'node-mocks-http';

export function createMockedHttpContext(
  method: RequestMethod,
  url: string
): { req: NextApiRequest; res: NextApiResponse } {
  return nodeMocksHttp.createMocks({
    method: method,
    url: url,
  });
}
