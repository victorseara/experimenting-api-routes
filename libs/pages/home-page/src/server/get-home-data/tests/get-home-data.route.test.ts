import { TRouteContext, createMockedHttpContext } from '@self/api-core/server';
import { GetHomeDataConfig } from '../../home-api-config';
import { GetHomeDataService } from '../get-home-data.service';
import { GetHomeDataRoute } from '../get-home-data.route';

describe('GetHomeDataRoute', () => {
  let mockContext: TRouteContext;
  let mockService: jest.Mocked<GetHomeDataService>;

  beforeEach(() => {
    const { req, res } = createMockedHttpContext(
      GetHomeDataConfig.method,
      GetHomeDataConfig.path
    );

    mockContext = { request: req, response: res };

    mockService = {
      execute: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call the service and return its response', async () => {
    const route = new GetHomeDataRoute(mockContext, '', mockService);
    const response = { message: 'test' };
    mockService.execute.mockResolvedValueOnce(response);

    await route.handler();

    expect(mockService.execute).toHaveBeenCalledTimes(1);
    expect(mockService.execute).toHaveBeenCalledWith();
  });

  test('should propagate the service error', async () => {
    const route = new GetHomeDataRoute(mockContext, '', mockService);
    mockService.execute.mockRejectedValueOnce(new Error('test'));

    await expect(route.handler()).rejects.toThrow();

    expect(mockService.execute).toHaveBeenCalledTimes(1);
  });
});
