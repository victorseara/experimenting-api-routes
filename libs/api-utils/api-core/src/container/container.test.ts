import { Container } from './container';

describe(Container.name, () => {
  test('should create a new container', () => {
    const container = new Container();
    expect(container).toBeDefined();
  });
});
