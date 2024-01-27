import { CoreInjectionKeys } from '../core-injection-keys';
import { InternalServerError, NotFoundError } from '../errors/api-errors';
import { RouteDiscover } from './route-discover';

describe('RouteDiscover', () => {
  let mockContainer: any;
  let mockRoutes: any;
  let mockRequest: any;

  beforeEach(() => {
    mockRoutes = {};

    mockRequest = { url: '/test', method: 'GET' };

    mockContainer = {
      resolve: jest.fn(),
      isRegistered: jest.fn(),
    };
  });

  test('should throw InternalServerError if no url or method in request', () => {
    mockRequest = {};
    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);
    expect(() => routeDiscover.execute(mockContainer)).toThrow(
      InternalServerError
    );
  });

  test('should resolve auth route if requestedPath includes auth', () => {
    mockRequest.url = '/auth';
    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);
    routeDiscover.execute(mockContainer);
    expect(mockContainer.resolve).toHaveBeenCalledWith(CoreInjectionKeys.Auth);
  });

  test('should resolve plain route if container has registered the route', () => {
    mockContainer.isRegistered.mockReturnValueOnce(true);
    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);

    routeDiscover.execute(mockContainer);

    expect(mockContainer.resolve).toHaveBeenCalledWith(
      `${mockRequest.method} ${mockRequest.url}`
    );
  });

  test('should throw NotFoundError if container has not registered the route', () => {
    mockContainer.isRegistered.mockReturnValueOnce(false);
    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);
    expect(() => routeDiscover.execute(mockContainer)).toThrow(NotFoundError);
  });

  test('should resolve route with params if container has registered the route', () => {
    mockRequest.url = '/test/1';
    mockRoutes = { 'GET /test/:id': {} };
    mockContainer.isRegistered
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);

    routeDiscover.execute(mockContainer);
    expect(mockContainer.resolve).toHaveBeenCalledWith('GET /test/:id');
  });

  test('should resolve nested route with params', () => {
    mockRequest.url = '/test/1/nested/2';
    mockRoutes = {
      'GET /test/:id': {},
      'GET /test/:id/nested/:nestedId': {},
    };

    mockContainer.isRegistered
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);

    routeDiscover.execute(mockContainer);

    expect(mockContainer.resolve).toHaveBeenCalledWith(
      'GET /test/:id/nested/:nestedId'
    );
  });

  test('should resolve route with query', () => {
    mockRequest.url = '/test?id=1&page=2';

    mockRoutes = {
      'GET /test': {},
    };

    mockContainer.isRegistered
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const routeDiscover = new RouteDiscover(mockRoutes, mockRequest);

    routeDiscover.execute(mockContainer);

    expect(mockContainer.resolve).toHaveBeenCalledWith('GET /test');
  });
});
