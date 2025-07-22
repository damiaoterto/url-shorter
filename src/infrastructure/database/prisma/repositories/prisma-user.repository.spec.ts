import { PrismaClient } from '@generated/prisma';
import { User } from '@domain/user/entity/user.entity';
import { PrismaUserRepository } from './prisma-user.repository';
import { UserRepository } from '@domain/user/repository/user.repository';

describe('PrismaUserRepository', () => {
  let repository: UserRepository;

  let prismaClientMock: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(() => {
    prismaClientMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
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
    it('should return a user when found', async () => {
      const email = 'found@example.com';
      const dbUser = {
        id: 'user-id-1',
        name: 'Found User',
        email: email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaClientMock.user.findUnique.mockResolvedValue(dbUser);

      const result = await repository.findByEmail(email);

      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(dbUser);
      expect(result).toBeInstanceOf(Object);
    });

    it('should return undefined when user is not found', async () => {
      const email = 'notfound@example.com';

      prismaClientMock.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(prismaClientMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeUndefined();
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
