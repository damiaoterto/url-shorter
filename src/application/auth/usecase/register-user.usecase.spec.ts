import { BadRequestException } from '@nestjs/common';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { InMemoryUserRepository } from '@domain/user/repository/in-memory.repository';
import { RegisterUseCase } from './register-user.usecase';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { HashAlg } from '@infrastructure/crypt/algs/hash.alg';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: UserRepository;
  let hashAlg: HashAlg;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();

    hashAlg = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    useCase = new RegisterUseCase(userRepository, hashAlg);
  });

  it('should create a new user successfully', async () => {
    const input: RegisterUserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'plain_password_123',
      passwordConfirm: 'plain_password_123',
    };
    const hashedPassword = 'hashed_password';

    (hashAlg.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const output = await useCase.execute(input);

    expect(output).toBeDefined();
    expect(output.name).toBe(input.name);

    expect(hashAlg.hash).toHaveBeenCalledTimes(1);
    expect(hashAlg.hash).toHaveBeenCalledWith(input.password);

    const savedUser = await userRepository.findByEmail(input.email);

    expect(savedUser!.password).toBe(hashedPassword);
  });

  it('should throw a BadRequestException if user already exists', async () => {
    const existingUser = User.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashed_password_abc',
    });
    await userRepository.createNew(existingUser);

    const input: RegisterUserDTO = {
      name: 'Another Jane',
      email: 'jane.doe@example.com',
      password: 'another_password',
      passwordConfirm: 'another_password',
    };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);

    expect(hashAlg.hash).not.toHaveBeenCalled();
  });
});
