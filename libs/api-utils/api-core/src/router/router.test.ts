import { AbstractRoute } from '../route/route-abstract';
import { Router } from './router';
import nodeMocksHttp from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { TRouteContext, TRouteHandler } from '../route/route.types';
import { inject, injectable } from 'tsyringe';
import { SharedInjectionKeys } from '../injection-keys';
import { Container } from '../container/container';

const mockHandler = jest.fn(() => Promise.resolve());
const mockAuthHandler = jest.fn(() => Promise.resolve());

@injectable()
class MockRoute extends AbstractRoute<unknown> {
  constructor(
    @inject(SharedInjectionKeys.RequestContext) context: TRouteContext<unknown>
  ) {
    super(context);
  }

  handler: TRouteHandler = mockHandler;
}

@injectable()
class MockAuthRoute extends AbstractRoute<unknown> {
  constructor(
    @inject(SharedInjectionKeys.RequestContext) context: TRouteContext<unknown>
  ) {
    super(context);
  }

  handler: TRouteHandler = mockAuthHandler;
}

describe('Router test', () => {
  test('handle a request to a valid route', async () => {
    const router = new Router({
      routes: { 'GET /test': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test',
      });

    mockHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('handle a request with params', async () => {
    const router = new Router({
      routes: { 'GET /test/:id': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test/1',
      });

    mockHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('dispose the container after the request is handled', async () => {
    const spyOnDispose = jest.spyOn(Container.prototype, 'dispose');

    const router = new Router({
      routes: { 'GET /test': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test',
      });

    mockHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(spyOnDispose).toHaveBeenCalled();
  });

  test("should return error if the route doesn't exist", async () => {
    const router = new Router({
      routes: { 'GET /test': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test2',
      });

    await router.handler({
      request: req,
      response: res,
    });

    expect(res.statusCode).toBe(500);
  });

  test('should return error if request is invalid', async () => {
    const router = new Router({
      routes: { 'GET /test': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({});

    await router.handler({
      request: req,
      response: res,
    });

    expect(res.statusCode).toBe(500);
  });

  test('should handle requests with query params', async () => {
    const router = new Router({
      routes: { 'GET /test': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test?test=1',
      });

    mockHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('should handle requests with query params and path params', async () => {
    const router = new Router({
      routes: { 'GET /test/:id': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test/1?test=1',
      });

    mockHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('should handle nested routes', async () => {
    const router = new Router({
      routes: { 'GET /': MockRoute, 'GET /test/:id/nested': MockRoute },
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'GET',
        url: '/test/1/nested',
      });

    mockHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('should redirect to the auth if its an authentication related route', async () => {
    const router = new Router({
      routes: { 'GET /': MockRoute },
      auth: MockAuthRoute,
    });

    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      nodeMocksHttp.createMocks({
        method: 'POST',
        url: '/auth/any',
      });

    mockAuthHandler.mockImplementationOnce(async () => {
      res.status(200).end();
    });

    await router.handler({
      request: req,
      response: res,
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });
});
