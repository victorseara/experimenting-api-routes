import { Container } from './container';
import { container as tsyringeContainer } from 'tsyringe';

describe('Container test', () => {
  test('should create a new dependency container', () => {
    const containerSpy = jest.spyOn(tsyringeContainer, 'createChildContainer');
    const container = new Container();

    expect(container).toBeDefined();
    expect(containerSpy).toHaveBeenCalled();
  });

  test('should register a class', () => {
    const container = new Container();
    const token = 'token';

    class TestClass {}

    container.registerClass(token, TestClass);
    expect(container.resolve(token)).toBeInstanceOf(TestClass);
  });

  test('should not register a class twice', () => {
    const container = new Container();
    const token = 'token';

    class TestClass {}

    container.registerClass(token, TestClass);
    expect(() => container.registerClass(token, TestClass)).toThrow();
  });

  test('should register a value', () => {
    const container = new Container();
    const token = 'token';
    const value = { content: 'any value' };

    container.registerValue(token, value);
    expect(container.resolve(token)).toEqual(value);
  });

  test('should not register a value twice', () => {
    const container = new Container();
    const token = 'token';
    const value = { content: 'any value' };

    container.registerValue(token, value);
    expect(() => container.registerValue(token, value)).toThrow();
  });

  test('should check if a token is registered', () => {
    const container = new Container();
    const token = 'token';
    const value = { content: 'any value' };

    container.registerValue(token, value);
    expect(container.isRegistered(token)).toBeTruthy();

    const notRegisteredToken = 'notRegisteredToken';
    expect(container.isRegistered(notRegisteredToken)).toBeFalsy();
  });

  test('should dispose the container', () => {
    const container = new Container();

    const token = 'token';
    const value = { content: 'any value' };

    container.registerValue(token, value);
    container.dispose();

    expect(() => container.resolve(token)).toThrow();
    expect(() => container.registerValue(token, value)).toThrow();
    expect(() => container.isRegistered(token)).toThrow();
  });
});
