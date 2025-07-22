import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { HashAlg } from '@infrastructure/crypt/algs/hash.alg';
import { JwtToken } from '@domain/auth/entities/jwt-token.entity';
import { LoginUserDTO } from '../dto/login-user.dto';
import { LoginUserUseCase } from './login-user.usecase';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashAlg: jest.Mocked<HashAlg>;

  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      createNew: jest.fn(),
      addURL: jest.fn(),
    };
    hashAlg = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    useCase = new LoginUserUseCase(
      userRepository,
      hashAlg,
      jwtService as JwtService,
    );
  });

  const loginDto: LoginUserDTO = {
    email: 'test@example.com',
    password: 'plain_password',
  };

  const storedUser = User.create({
    id: 'user-id-123',
    name: 'Test User',
    email: loginDto.email,
    password: 'hashed_password_from_db',
  });

  it('should return a JWT token on successful login', async () => {
    const fakeAccessToken = 'fake.jwt.token';
    userRepository.findByEmail.mockResolvedValue(storedUser);
    hashAlg.verify.mockResolvedValue(true);

    (jwtService.signAsync as jest.Mock).mockResolvedValue(fakeAccessToken);

    const result = await useCase.execute(loginDto);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(hashAlg.verify).toHaveBeenCalledWith(
      storedUser.password,
      loginDto.password,
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: storedUser.id,
      email: storedUser.email,
    });
    expect(result).toBeInstanceOf(JwtToken);
    expect(result.accessToken).toBe(fakeAccessToken);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(undefined);

    await expect(useCase.execute(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(hashAlg.verify).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    userRepository.findByEmail.mockResolvedValue(storedUser);
    hashAlg.verify.mockResolvedValue(false);

    await expect(useCase.execute(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
