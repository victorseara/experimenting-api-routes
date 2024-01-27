import { z } from 'zod';
import { createMockedHttpContext } from '../test-utils/api-test-utils';
import { AbstractRoute } from './abstract-route';
import { TRouteContext } from './route.types';
import { BadRequestError } from '../server';

const testSchema = z.object({
  test: z.string(),
});

type TestSchema = z.infer<typeof testSchema>;

class TestRoute extends AbstractRoute {
  handler = jest.fn();

  testBody(zodSchema: z.ZodTypeAny) {
    return this.parseBody(zodSchema);
  }

  testParams(zodSchema: z.ZodTypeAny) {
    return this.parseParams(zodSchema);
  }

  testQuery(zodSchema: z.ZodTypeAny) {
    return this.parseQuery(zodSchema);
  }
}

describe('AbstractRoute', () => {
  test('body: parse when its valid', () => {
    const routeConfig = { method: 'POST', path: '/test' };
    const body: TestSchema = { test: 'test' };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      body,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, 'test');

    const result = route.testBody(testSchema);
    expect(result).toEqual(body);
  });

  test('body: throws BadRequest when its invalid', () => {
    const routeConfig = { method: 'POST', path: '/test' };
    const body = { invalid: 'test' };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      body,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, 'test');

    expect(() => route.testBody(testSchema)).toThrow(BadRequestError);
  });

  test('query: parse when its valid', () => {
    const routeConfig = { method: 'POST', path: '/test' };
    const query: TestSchema = { test: 'test' };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      query,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, routeConfig.path);

    const result = route.testQuery(testSchema);
    expect(result).toEqual(query);
  });

  test('query: throws BadRequest when its invalid', () => {
    const routeConfig = { method: 'POST', path: '/test' };
    const query = { invalid: 'test' };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      query,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, routeConfig.path);

    expect(() => route.testQuery(testSchema)).toThrow(BadRequestError);
  });

  test('params: parse when its valid', () => {
    const routeConfig = { method: 'POST', path: '/api/test' };

    const routeParams = {
      api: ['test', 'any'],
    };

    const expectedParams: TestSchema = {
      test: 'any',
    };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      query: routeParams,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, '/api/test/:test');

    const result = route.testParams(testSchema);
    expect(result).toEqual(expectedParams);
  });

  test('params: throws BadRequest when passed params are invalid', () => {
    const routeConfig = { method: 'POST', path: '/api/test' };

    const routeParams = {
      api: 'any',
    };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      query: routeParams,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, '/api/test/:test');

    expect(() => route.testParams(testSchema)).toThrow(BadRequestError);
  });

  test('params: throws BadRequest when it fails to parse', () => {
    const routeConfig = { method: 'POST', path: '/api/test' };

    const routeSchema = z.object({
      test: z.number(),
    });

    const routeParams = {
      api: ['test', 'any'],
    };

    const { req, res } = createMockedHttpContext('POST', routeConfig.path, {
      query: routeParams,
    });

    const context = { request: req, response: res };
    const route = new TestRoute(context, '/api/test/:test');

    expect(() => route.testParams(routeSchema)).toThrow(BadRequestError);
  });
});
