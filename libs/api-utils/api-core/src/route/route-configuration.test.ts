import { InternalServerError } from '../server';
import { RouteConfiguration } from './route-configuration';

describe('RouteConfiguration', () => {
  let routeConfig: RouteConfiguration;

  beforeEach(() => {
    routeConfig = new RouteConfiguration('GET', '/test/:id');
  });

  test('should initialize with correct method and path', () => {
    expect(routeConfig.method).toBe('GET');
    expect(routeConfig.path).toBe('/test');
  });

  test('should generate correct injection key', () => {
    expect(routeConfig.injectionKey).toBe('GET /test/:id');
  });

  test('should validate injection key correctly', () => {
    const invalidPath = ['POST', '/ test / :id'];
    const invalidMethod = ['INVALID', '/test/:id'];

    const invalidRoutePath = new RouteConfiguration(
      /* @ts-ignore */
      invalidPath[0],
      invalidPath[1]
    );
    const invalidRouteMethod = new RouteConfiguration(
      /* @ts-ignore */
      invalidMethod[0],
      invalidMethod[1]
    );

    expect(() => invalidRoutePath.injectionKey).toThrow(InternalServerError);
    expect(() => invalidRouteMethod.injectionKey).toThrow(InternalServerError);
  });
});
