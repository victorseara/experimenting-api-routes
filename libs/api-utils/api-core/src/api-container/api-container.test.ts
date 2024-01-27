import { Container } from '../container/container';
import { CoreInjectionKeys } from '../core-injection-keys';
import { InternalServerError, TRouterConfiguration } from '../server';
import { ApiContainer } from './api-container';
import { IApiContainer } from './api-container.types';

describe('ApiContainer', () => {
  let config: TRouterConfiguration;
  let apiContainer: IApiContainer;

  beforeEach(() => {
    config = {
      routes: {
        route1: jest.fn(),
        route2: jest.fn(),
      },
      basePath: '/api',
      auth: jest.fn(),
      log: 'debug',
      openApi: [class OpenApi1 {}, class OpenApi2 {}],
      dependencies: jest.fn(),
    };
    apiContainer = new ApiContainer(config);
  });

  it('should throw error if container is not initialized', () => {
    expect(() => apiContainer.current).toThrow(InternalServerError);
  });

  it('should initialize the container', () => {
    const registerClassSpy = jest.spyOn(Container.prototype, 'registerClass');
    const registerValueSpy = jest.spyOn(Container.prototype, 'registerValue');
    apiContainer.initialize();

    expect(registerClassSpy).toHaveBeenCalledTimes(6);
    expect(registerValueSpy).toHaveBeenCalledTimes(3);
    expect(config.dependencies).toHaveBeenCalledWith(apiContainer);
  });

  it('should add request context', () => {
    const context = { req: {}, res: {} };
    const registerValueSpy = jest.spyOn(Container.prototype, 'registerValue');
    apiContainer.initialize();
    apiContainer.addRequestContext(context);

    const requestContextCall = registerValueSpy.mock.calls.find(
      (call) => call[0] === CoreInjectionKeys.RequestContext
    );

    expect(requestContextCall).toBeDefined();

    expect(requestContextCall).toEqual([
      CoreInjectionKeys.RequestContext,
      context,
    ]);
  });

  it('should dispose the container', () => {
    const disposeSpy = jest.spyOn(Container.prototype, 'dispose');
    apiContainer.initialize();
    apiContainer.dispose();

    expect(disposeSpy).toHaveBeenCalled();
  });
});
