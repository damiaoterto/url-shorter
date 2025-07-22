import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@infrastructure/config/services/config.service';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;
  let reflector: Partial<Reflector>;

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
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    configService = { get: jest.fn() };
    reflector = { getAllAndOverride: jest.fn() };

    guard = new AuthGuard(
      configService as ConfigService,
      jwtService as JwtService,
      reflector as Reflector,
    );
  });

  describe('when route is private', () => {
    beforeEach(() => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
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

  describe('when route is public', () => {
    beforeEach(() => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
    });

    it('should return true if route is public and no token is provided', async () => {
      const mockContext = createMockContext({});

      const canActivate = await guard.canActivate(mockContext);

      expect(canActivate).toBe(true);
      // Garante que a verificação do token não foi tentada
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should still try to validate the token if one is provided, even on a public route', async () => {
      const mockContext = createMockContext({
        authorization: 'Bearer fake-token',
      });
      (configService.get as jest.Mock).mockReturnValue('any-secret');
      (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: '123' });

      const canActivate = await guard.canActivate(mockContext);

      expect(canActivate).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if a token is provided but is invalid, even on a public route', async () => {
      const mockContext = createMockContext({
        authorization: 'Bearer invalid-token',
      });
      (configService.get as jest.Mock).mockReturnValue('any-secret');
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
        new Error('JWT error'),
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
