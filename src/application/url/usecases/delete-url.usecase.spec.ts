import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UrlRepository } from '@domain/url/repositories/url.repository';
import { UserRepository } from '@domain/user/repository/user.repository';
import { User } from '@domain/user/entity/user.entity';
import { Url } from '@domain/url/entities/url.entity';
import { DeleteUrlUseCase } from './delete-url.usecase';

describe('DeleteUrlUseCase', () => {
  let useCase: DeleteUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    urlRepository = {
      findById: jest.fn(),
      delete: jest.fn(),

      findByShortCode: jest.fn(),
      update: jest.fn(),
      createNew: jest.fn(),
    };
    userRepository = {
      findByEmail: jest.fn(),

      addURL: jest.fn(),
      createNew: jest.fn(),
    };

    useCase = new DeleteUrlUseCase(urlRepository, userRepository);
  });

  const urlToDelete = Url.create({ id: 'url-123' } as Url);
  const ownerUser = User.create({
    id: 'user-456',
    email: 'owner@example.com',
    urls: [urlToDelete],
  } as User);
  const deleteData = { id: urlToDelete.id!, email: ownerUser.email };

  it('should delete the url successfully when user is the owner', async () => {
    userRepository.findByEmail.mockResolvedValue(ownerUser);
    urlRepository.findById.mockResolvedValue(urlToDelete);
    urlRepository.delete.mockResolvedValue(undefined);

    await useCase.execute(deleteData);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(deleteData.email);
    expect(urlRepository.findById).toHaveBeenCalledWith(deleteData.id);
    expect(urlRepository.delete).toHaveBeenCalledWith(deleteData.id);
  });

  it('should throw UnauthorizedException if the user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(undefined);

    await expect(useCase.execute(deleteData)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw NotFoundException if the url does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(ownerUser);
    urlRepository.findById.mockResolvedValue(undefined);

    await expect(useCase.execute(deleteData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw UnauthorizedException if the user does not own the url', async () => {
    const nonOwnerUser = User.create({
      id: 'user-789',
      email: 'non-owner@example.com',
    } as User);
    userRepository.findByEmail.mockResolvedValue(nonOwnerUser);
    urlRepository.findById.mockResolvedValue(urlToDelete);

    await expect(
      useCase.execute({ ...deleteData, email: nonOwnerUser.email }),
    ).rejects.toThrow('User not authorized to delete this url');
  });
});
