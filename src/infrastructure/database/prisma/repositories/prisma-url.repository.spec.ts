import { PrismaClient } from '@generated/prisma';
import { Url } from '@domain/url/entities/url.entity';
import { PrismaUrlRepository } from './prisma-url.repository';

describe('PrismaUrlRepository', () => {
  let repository: PrismaUrlRepository;
  let prismaClientMock: {
    url: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(() => {
    prismaClientMock = {
      url: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    repository = new PrismaUrlRepository(
      prismaClientMock as any as PrismaClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByShortCode', () => {
    it('should return a Url entity when found', async () => {
      const dbUrl = {
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'abcde',
        clicks: BigInt(10),
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      prismaClientMock.url.findUnique.mockResolvedValue(dbUrl);

      const result = await repository.findByShortCode('abcde');

      expect(prismaClientMock.url.findUnique).toHaveBeenCalledWith({
        where: { shortCode: 'abcde' },
      });
      expect(result).toBeInstanceOf(Url);
      expect(result?.clicks).toBe(10);
    });

    it('should return undefined when not found', async () => {
      prismaClientMock.url.findUnique.mockResolvedValue(null);

      const result = await repository.findByShortCode('notfound');

      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a Url entity when found', async () => {
      const dbUrl = {
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'abcde',
        clicks: BigInt(5),
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      prismaClientMock.url.findUnique.mockResolvedValue(dbUrl);

      const result = await repository.findById('1');

      expect(prismaClientMock.url.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBeInstanceOf(Url);
      expect(result?.clicks).toBe(5);
    });

    it('should return undefined when not found', async () => {
      prismaClientMock.url.findUnique.mockResolvedValue(null);

      const result = await repository.findById('notfound');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should call prisma.update with correct data', async () => {
      const id = '1';
      const data = { clicks: 1 };
      const fixedDate = new Date('2025-01-01T00:00:00.000Z');
      jest.useFakeTimers().setSystemTime(fixedDate);

      await repository.update(id, data);

      expect(prismaClientMock.url.update).toHaveBeenCalledWith({
        where: { id },
        data: { ...data, updatedAt: fixedDate },
      });
      jest.useRealTimers();
    });
  });

  describe('delete', () => {
    it('should call prisma.update with a deletedAt date', async () => {
      const id = '1';
      const fixedDate = new Date('2025-01-01T00:00:00.000Z');
      jest.useFakeTimers().setSystemTime(fixedDate);

      await repository.delete(id);

      expect(prismaClientMock.url.update).toHaveBeenCalledWith({
        where: { id },
        data: { deletedAt: fixedDate },
      });
      jest.useRealTimers();
    });
  });

  describe('createNew', () => {
    it('should call prisma.create with correct entity data', async () => {
      const entity = Url.create({
        id: '1',
        originalUrl: 'https://example.com',
        shortCode: 'abcde',
        clicks: 0,
        createdAt: new Date(),
      } as Url);

      await repository.createNew(entity);

      expect(prismaClientMock.url.create).toHaveBeenCalledWith({
        data: {
          id: entity.id,
          originalUrl: entity.originalUrl,
          clicks: entity.clicks,
          shortCode: entity.shortCode,
          createdAt: entity.createdAt,
        },
      });
    });
  });
});
