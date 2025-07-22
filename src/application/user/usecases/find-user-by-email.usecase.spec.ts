import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '@domain/user/repository/user.repository';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { FindUserByEmailUseCase } from './find-user-by-email.usecase';
import { User } from '@domain/user/entity/user.entity';

describe('FindUserByEmailUseCase', () => {
  let useCase: UseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      createNew: jest.fn(),
      addURL: jest.fn(),
    };

    useCase = new FindUserByEmailUseCase(userRepository);
  });

  it('should return a user when found by email', async () => {
    const userEmail = 'found@example.com';

    const expectedUser = User.create({
      id: 'user-123',
      name: 'Test User',
      email: userEmail,
      password: 'hashed_password',
    });

    userRepository.findByEmail.mockResolvedValue(expectedUser);

    const result = await useCase.execute(userEmail);

    expect(result).toEqual(expectedUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundException when user is not found', async () => {
    const userEmail = 'notfound@example.com';
    userRepository.findByEmail.mockResolvedValue(undefined);

    await expect(useCase.execute(userEmail)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(userEmail)).rejects.toThrow('User not found');
  });
});
