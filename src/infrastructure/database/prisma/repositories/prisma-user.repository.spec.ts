import { PrismaClient } from '@generated/prisma';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { Url } from '@domain/url/entities/url.entity';
import { PrismaUserRepository } from './prisma-user.repository';

describe('PrismaUserRepository', () => {
  let repository: UserRepository;

  let prismaClientMock: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(() => {
    prismaClientMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    repository = new PrismaUserRepository(
      prismaClientMock as any as PrismaClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return a user with its URLs when found', async () => {
      const email = 'found@example.com';
      const dbUserWithUrls = {
        id: 'user-id-1',
        name: 'Found User',
        email: email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: null,
        urls: [
          {
            id: 'url-1',
            originalUrl: 'https://test.com',
            shortCode: 'g-short',
            clicks: BigInt(10),
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
            userId: 'user-id-1',
          },
        ],
      };
      prismaClientMock.user.findUnique.mockResolvedValue(dbUserWithUrls);

      const result = await repository.findByEmail(email);

      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: { urls: true },
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.urls).toHaveLength(1);
      expect(result?.urls?.[0]).toBeInstanceOf(Url);
      expect(result?.urls?.[0].clicks).toBe(10);
    });

    it('should return undefined when user is not found', async () => {
      const email = 'notfound@example.com';
      prismaClientMock.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: { urls: true },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('addURL', () => {
    it('should call prisma.user.update with the correct connect data', async () => {
      const email = 'user@example.com';
      const url = Url.create({ id: 'url-to-connect' } as Url);
      prismaClientMock.user.update.mockResolvedValue({});

      await repository.addURL(email, url);

      expect(prismaClientMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaClientMock.user.update).toHaveBeenCalledWith({
        where: { email },
        data: {
          urls: { connect: { id: url.id } },
        },
      });
    });
  });

  describe('createNew', () => {
    it('should call prisma.user.create with the correct data', async () => {
      const userEntity = User.create({
        id: 'user-id-2',
        name: 'New User',
        email: 'new@example.com',
        password: 'new_hashed_password',
        createdAt: new Date(),
      });
      prismaClientMock.user.create.mockResolvedValue(userEntity);

      await repository.createNew(userEntity);

      expect(prismaClientMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaClientMock.user.create).toHaveBeenCalledWith({
        data: {
          id: userEntity.id,
          name: userEntity.name,
          email: userEntity.email,
          password: userEntity.password,
          createdAt: userEntity.createdAt,
        },
      });
    });
  });
});
