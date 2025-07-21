import { BadRequestException } from '@nestjs/common';
import { UserRepository } from '@domain/user/repository/user.repository';
import { User } from '@domain/user/entity/user.entity';
import { InMemoryUserRepository } from '@domain/user/repository/in-memory.repository';
import { RegisterUseCase } from './register-user.usecase';
import { RegisterUserDTO } from '../dto/register-user.dto';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    useCase = new RegisterUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const input: RegisterUserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    const output = await useCase.execute(input);

    expect(output).toBeDefined();
    expect(output).toBeInstanceOf(User);
    expect(output.name).toBe(input.name);
    expect(output.email).toBe(input.email);
    expect(output.id).toBeDefined();

    const savedUser = await userRepository.findByEmail(input.email);
    expect(savedUser).toEqual(output);
  });

  it('should throw a BadRequestException if user already exists', async () => {
    const existingUser = User.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password456',
    });
    await userRepository.createNew(existingUser);

    const input: RegisterUserDTO = {
      name: 'Another Jane',
      email: 'jane.doe@example.com',
      password: 'another_password',
      passwordConfirm: 'another_password',
    };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    await expect(useCase.execute(input)).rejects.toThrow('User already exists');
  });
});
