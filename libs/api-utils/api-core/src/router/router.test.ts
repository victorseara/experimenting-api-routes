import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { ApiContainer } from '../api-container/api-container';
import { Container } from '../container/container';
import { CoreInjectionKeys } from '../core-injection-keys';
import { RouteDiscover } from '../route-discover/route-discover';
import { AbstractRoute } from '../route/abstract-route';
import { RouteConfiguration } from '../route/route-configuration';
import { NotFoundError, TRouteContext } from '../server';
import { Router } from './router';
import { createMockedHttpContext } from '../test-utils/api-test-utils';

const mockRouteHandler = jest.fn();
const MockRouteConfig = new RouteConfiguration('GET', '/test');

@injectable()
class MockRoute extends AbstractRoute<unknown> {
  constructor(
    @inject(CoreInjectionKeys.RequestContext) context: TRouteContext<unknown>
  ) {
    super(context, MockRouteConfig.injectionKey);
  }
  handler = mockRouteHandler;
}

describe('Router class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should initialize the container and add request context on handler call', async () => {
    const { req, res } = createMockedHttpContext('GET', MockRouteConfig.path);

    const spyOnApiContainerInitialize = jest.spyOn(
      ApiContainer.prototype,
      'initialize'
    );

    const spyOnApiContainerAddRequestContext = jest.spyOn(
      ApiContainer.prototype,
      'addRequestContext'
    );

    const router = new Router({
      routes: { [MockRouteConfig.injectionKey]: MockRoute },
    });

    await router.handler(req, res);

    expect(spyOnApiContainerInitialize).toHaveBeenCalledTimes(1);
    expect(spyOnApiContainerAddRequestContext).toHaveBeenCalledTimes(1);
    expect(spyOnApiContainerAddRequestContext).toHaveBeenCalledWith({
      request: req,
      response: res,
    });
  });

  test("should call route discover's execute method with the current container", async () => {
    const { req, res } = createMockedHttpContext('GET', MockRouteConfig.path);

    const spyOnRouteDiscoverExecute = jest.spyOn(
      RouteDiscover.prototype,
      'execute'
    );

    const router = new Router({
      routes: { [MockRouteConfig.injectionKey]: MockRoute },
    });

    await router.handler(req, res);

    expect(spyOnRouteDiscoverExecute).toHaveBeenCalledTimes(1);
    expect(spyOnRouteDiscoverExecute).toHaveBeenCalledWith(
      expect.any(Container)
    );
  });

  test("should handle a request and call the route's handler", async () => {
    const { req, res } = createMockedHttpContext('GET', MockRouteConfig.path);

    const router = new Router({
      routes: { [MockRouteConfig.injectionKey]: MockRoute },
    });

    await router.handler(req, res);
    expect(mockRouteHandler).toHaveBeenCalledTimes(1);
  });

  test('should handle errors and return the appropriate response', async () => {
    const { req, res } = createMockedHttpContext('GET', MockRouteConfig.path);

    const router = new Router({
      routes: { [MockRouteConfig.injectionKey]: MockRoute },
    });

    const error = new NotFoundError('Test Error');
    mockRouteHandler.mockImplementationOnce(() => Promise.reject(error));
    res.json = jest.fn();

    await router.handler(req, res);

    expect(res.statusCode).toBe(error.statusCode);
    expect(res.json).toHaveBeenCalledWith(error);
  });

  test('should dispose the container after the request is handled', async () => {
    const { req, res } = createMockedHttpContext('GET', MockRouteConfig.path);

    const router = new Router({
      routes: { [MockRouteConfig.injectionKey]: MockRoute },
    });

    const spyOnApiContainerDispose = jest.spyOn(
      ApiContainer.prototype,
      'dispose'
    );

    await router.handler(req, res);

    expect(spyOnApiContainerDispose).toHaveBeenCalledTimes(1);
  });
});
