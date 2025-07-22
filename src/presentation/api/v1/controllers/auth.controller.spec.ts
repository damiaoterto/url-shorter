import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from '@application/auth/usecase/register-user.usecase';
import { LoginUserUseCase } from '@application/auth/usecase/login-user.usecase';
import { FindUserByEmailUseCase } from '@application/user/usecases/find-user-by-email.usecase';
import { RegisterUserDTO } from '@application/auth/dto/register-user.dto';
import { LoginUserDTO } from '@application/auth/dto/login-user.dto';
import { User } from '@domain/user/entity/user.entity';
import { JwtToken } from '@domain/auth/entities/jwt-token.entity';
import { ConfigService } from '@infrastructure/config/services/config.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUseCase: RegisterUseCase;
  let loginUserUseCase: LoginUserUseCase;
  let findUserByEmailUseCase: FindUserByEmailUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: LoginUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindUserByEmailUseCase,
          useValue: { execute: jest.fn() },
        },

        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
    loginUserUseCase = module.get<LoginUserUseCase>(LoginUserUseCase);
    findUserByEmailUseCase = module.get<FindUserByEmailUseCase>(
      FindUserByEmailUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call the LoginUserUseCase and return a JWT token', async () => {
      const loginDto: LoginUserDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const expectedToken = JwtToken.create({ accessToken: 'fake-jwt-token' });
      jest.spyOn(loginUserUseCase, 'execute').mockResolvedValue(expectedToken);

      const result = await controller.login(loginDto);

      expect(loginUserUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedToken);
    });
  });

  describe('register', () => {
    it('should call the RegisterUseCase and return the created user', async () => {
      const registerDto: RegisterUserDTO = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        passwordConfirm: 'password',
      };
      const expectedUser = User.create({ ...registerDto, id: 'user-123' });
      jest.spyOn(registerUseCase, 'execute').mockResolvedValue(expectedUser);

      const result = await controller.register(registerDto);

      expect(registerUseCase.execute).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('user', () => {
    it('should call the FindUserByEmailUseCase and return the user data', async () => {
      const userEmail = 'test@example.com';
      const expectedUser = User.create({
        id: 'user-123',
        name: 'Test',
        email: userEmail,
        password: 'hashed_password',
      });
      jest
        .spyOn(findUserByEmailUseCase, 'execute')
        .mockResolvedValue(expectedUser);

      const result = await controller.user(userEmail);

      expect(findUserByEmailUseCase.execute).toHaveBeenCalledWith(userEmail);
      expect(result).toEqual(expectedUser);
    });
  });
});
