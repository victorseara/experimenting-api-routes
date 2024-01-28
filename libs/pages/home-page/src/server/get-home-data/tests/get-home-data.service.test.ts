import { GetHomeDataService } from '../get-home-data.service';
import { TGetHomeDataResponse } from '../get-home-data.schema';

describe('GetHomeDataService', () => {
  test('should execute and return a valid response', async () => {
    const service = new GetHomeDataService();

    const expectedResponse: TGetHomeDataResponse = {
      message: 'Hello, world!',
    };

    const response = await service.execute();
    expect(response).toEqual(expectedResponse);
  });
});
