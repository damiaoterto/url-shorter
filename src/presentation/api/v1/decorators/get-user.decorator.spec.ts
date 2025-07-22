import { ExecutionContext } from '@nestjs/common';
import { getUserDecoratorFactory } from './get-user.decorator';

describe('GetUser Decorator', () => {
  const mockUser = {
    sub: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: user,
        }),
      }),
    } as ExecutionContext;
  };

  it('should return the entire user object when no data key is provided', () => {
    const context = createMockExecutionContext(mockUser);

    const result = getUserDecoratorFactory(undefined, context);

    expect(result).toEqual(mockUser);
  });

  it('should return a specific property from the user object when a data key is provided', () => {
    const context = createMockExecutionContext(mockUser);
    const propertyToExtract = 'email';

    const result = getUserDecoratorFactory(propertyToExtract, context);

    expect(result).toBe(mockUser.email);
  });

  it('should return undefined if the user object is not found on the request', () => {
    const contextWithoutUser = createMockExecutionContext(undefined);

    const result = getUserDecoratorFactory(undefined, contextWithoutUser);

    expect(result).toBeUndefined();
  });

  it('should return undefined if the requested data key does not exist on the user object', () => {
    const context = createMockExecutionContext(mockUser);
    const nonExistentProperty = 'age';

    const result = getUserDecoratorFactory(nonExistentProperty, context);

    expect(result).toBeUndefined();
  });
});
