import { Url } from '../entities/url.entity';
import { InMemoryRepository } from './in-memory-url.repository';
import { UrlRepository } from './url.repository';

describe('InMemoryRepository (Url)', () => {
  let repository: UrlRepository;
  let sampleUrl: Url;

  beforeEach(() => {
    repository = new InMemoryRepository();
    sampleUrl = Url.create({
      id: 'test-id-123',
      originalUrl: 'https://example.com',
      shortCode: 'abc1234',
      clicks: 0,
    } as Url);
  });

  describe('createNew', () => {
    it('should add a new url to the repository', async () => {
      await repository.createNew(sampleUrl);
      const foundUrl = await repository.findById(sampleUrl.id!);

      expect(foundUrl).toBeDefined();
      expect(foundUrl).toEqual(sampleUrl);
    });
  });

  // --- Tests for findByShortCode ---
  describe('findByShortCode', () => {
    it('should return a url when found by its short code', async () => {
      await repository.createNew(sampleUrl);

      const result = await repository.findByShortCode(sampleUrl.shortCode!);

      expect(result).toEqual(sampleUrl);
    });

    it('should return undefined if no url is found with the short code', async () => {
      const result = await repository.findByShortCode('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a url when found by its id', async () => {
      await repository.createNew(sampleUrl);

      const result = await repository.findById(sampleUrl.id!);

      expect(result).toEqual(sampleUrl);
    });

    it('should return undefined if no url is found with the id', async () => {
      const result = await repository.findById('nonexistent-id');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update the properties of an existing url', async () => {
      await repository.createNew(sampleUrl);
      const updateData = { originalUrl: 'https://new-example.com' };

      await repository.update(sampleUrl.id!, updateData);
      const updatedUrl = await repository.findById(sampleUrl.id!);

      expect(updatedUrl).toBeDefined();
      expect(updatedUrl?.originalUrl).toBe(updateData.originalUrl);
      expect(updatedUrl?.shortCode).toBe(sampleUrl.shortCode);
    });

    it('should throw an error when trying to update a nonexistent url', async () => {
      await expect(repository.update('nonexistent-id', {})).rejects.toThrow(
        'Url register not found',
      );
    });
  });

  describe('delete', () => {
    it('should remove a url from the repository', async () => {
      await repository.createNew(sampleUrl);

      await repository.delete(sampleUrl.id!);
      const result = await repository.findById(sampleUrl.id!);

      expect(result).toBeUndefined();
    });

    it('should throw an error when trying to delete a nonexistent url', async () => {
      await expect(repository.delete('nonexistent-id')).rejects.toThrow(
        'Url register not found',
      );
    });
  });
});
