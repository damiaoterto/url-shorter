import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UrlRepository } from '@domain/url/repositories/url.repository';
import { UserRepository } from '@domain/user/repository/user.repository';
import { Url } from '@domain/url/entities/url.entity';
import { User } from '@domain/user/entity/user.entity';
import { UpdateUrlUseCase } from './update-url.usecase';
import { PropertiesOnly } from '@shared/types/properties-only.type';

describe('UpdateUrlUseCase', () => {
  let useCase: UpdateUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    urlRepository = { findById: jest.fn(), update: jest.fn() } as any;
    userRepository = { findByEmail: jest.fn() } as any;
    useCase = new UpdateUrlUseCase(urlRepository, userRepository);
  });

  it('should update the url successfully when user is the owner', async () => {
    const urlEntity = {
      id: 'url-id-123',
      ...Url.prototype,
      originalUrl: 'https://initial-url.com',
    };

    const userEntity = {
      id: 'user-id-456',
      email: 'owner@example.com',
      urls: [urlEntity],
    };

    const updateInput = {
      id: urlEntity.id,
      email: userEntity.email,
      url: 'https://updated-url.com',
    };

    urlRepository.findById.mockResolvedValue(urlEntity as Url);
    userRepository.findByEmail.mockResolvedValue(userEntity as User);
    urlRepository.update.mockResolvedValue(undefined);

    await useCase.execute(updateInput);

    expect(urlRepository.findById).toHaveBeenCalledWith(updateInput.id);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(updateInput.email);
    expect(urlRepository.update).toHaveBeenCalledWith(
      updateInput.id,
      expect.objectContaining({
        originalUrl: updateInput.url,
      }),
    );
  });

  it('should throw NotFoundException if the url does not exist', async () => {
    urlRepository.findById.mockResolvedValue(undefined);

    await expect(
      useCase.execute({ id: '1', email: 'e@mail.com', url: 'u' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if the user does not exist', async () => {
    const urlEntity = { id: 'url-id-123' };
    urlRepository.findById.mockResolvedValue(urlEntity as Url);
    userRepository.findByEmail.mockResolvedValue(undefined);

    await expect(
      useCase.execute({ id: '1', email: 'e@mail.com', url: 'u' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if the user does not own the url', async () => {
    const urlEntity = { id: 'url-id-123' };
    const nonOwnerUser: PropertiesOnly<User> = {
      id: 'user-789',
      name: 'John',
      email: 'non-owner@example.com',
      password: '123414',
      urls: [],
    };
    urlRepository.findById.mockResolvedValue(urlEntity as Url);
    userRepository.findByEmail.mockResolvedValue(nonOwnerUser as User);

    await expect(
      useCase.execute({ id: 'url-id-123', email: 'non-owner@example.com' }),
    ).rejects.toThrow('User not authorized to update url');
  });
});
