import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@infrastructure/config/services/config.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  const createMockContext = (headers: {
    [key: string]: string;
  }): ExecutionContext => {
    const request = {
      headers,
    } as Request;

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  };

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    configService = { get: jest.fn() };

    guard = new AuthGuard(
      configService as ConfigService,
      jwtService as JwtService,
    );
  });

  it('should return true and attach user to the request if token is valid', async () => {
    const mockRequestHeaders = { authorization: 'Bearer fake-token' };
    const mockContext = createMockContext(mockRequestHeaders);
    const mockUserPayload = { sub: 'user-123', email: 'test@example.com' };
    const mockJwtSecret = 'super-secret-key';

    (configService.get as jest.Mock).mockReturnValue(mockJwtSecret);
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockUserPayload);

    const canActivate = await guard.canActivate(mockContext);
    const requestWithUser = mockContext.switchToHttp().getRequest();

    expect(canActivate).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('fake-token', {
      secret: mockJwtSecret,
    });
    expect(requestWithUser['user']).toEqual(mockUserPayload);
  });

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const mockContext = createMockContext({});

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if header is not "Bearer" type', async () => {
    const mockContext = createMockContext({
      authorization: 'Basic some-other-token',
    });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is missing after "Bearer"', async () => {
    const mockContext = createMockContext({ authorization: 'Bearer ' });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if jwtService.verifyAsync fails', async () => {
    const mockContext = createMockContext({
      authorization: 'Bearer invalid-token',
    });
    (configService.get as jest.Mock).mockReturnValue('any-secret');

    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
      new Error('Invalid token'),
    );

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
