import { randomBytes, randomUUID } from 'node:crypto';
import { Url } from './url.entity';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(),
  randomBytes: jest.fn(),
}));

describe('Url Entity', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('create', () => {
    it('should create a new Url with default values when only originalUrl is provided', () => {
      const mockUUID = 'mock-uuid-12345';
      const mockShortCode = 'abcdef';
      const mockDate = new Date('2025-07-21T22:00:00.000Z');

      (randomUUID as jest.Mock).mockReturnValue(mockUUID);
      (randomBytes as jest.Mock).mockReturnValue(
        Buffer.from(mockShortCode, 'hex'),
      );
      jest.useFakeTimers().setSystemTime(mockDate);

      const inputData = {
        originalUrl: 'https://example.com/very/long/url',
      } as Url;

      const url = Url.create(inputData);

      expect(url).toBeInstanceOf(Url);
      expect(url.originalUrl).toBe(inputData.originalUrl);
      expect(url.id).toBe(mockUUID);
      expect(url.shortCode).toBe(mockShortCode);
      expect(url.clicks).toBe(0);
      expect(url.createdAt).toEqual(mockDate);
      expect(url.updatedAt).toBeNull();
      expect(url.deletedAt).toBeNull();
    });

    it('should create a new Url using provided values instead of defaults', () => {
      const providedData = {
        id: 'provided-id-123',
        originalUrl: 'https://google.com',
        shortCode: 'g-short',
        shortUrl: 'http://localhost:3000/abcrd3S',
        clicks: 100,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-02-01'),
        deletedAt: null,
      };

      const url = Url.create(providedData);

      expect(url.id).toBe(providedData.id);
      expect(url.shortCode).toBe(providedData.shortCode);
      expect(url.shortUrl).toBe(providedData.shortUrl);
      expect(url.clicks).toBe(providedData.clicks);
      expect(url.createdAt).toEqual(providedData.createdAt);
      expect(url.updatedAt).toEqual(providedData.updatedAt);

      expect(randomUUID).not.toHaveBeenCalled();
      expect(randomBytes).not.toHaveBeenCalled();
    });
  });

  describe('incrementClick', () => {
    it('should increase the clicks count by one', () => {
      const url = Url.create({
        originalUrl: 'https://test.com',
        clicks: 5,
      } as Url);

      url.incrementClick();

      expect(url.clicks).toBe(6);
    });
  });
});
