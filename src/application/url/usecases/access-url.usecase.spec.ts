import { NotFoundException } from '@nestjs/common';
import { UrlRepository } from '@domain/url/repositories/url.repository';
import { Url } from '@domain/url/entities/url.entity';
import { AccessUrlUseCase } from './access-url.usecase';

describe('AccessUrlUseCase', () => {
  let useCase: AccessUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(() => {
    urlRepository = {
      findByShortCode: jest.fn(),
    } as any;

    useCase = new AccessUrlUseCase(urlRepository);
  });

  it('should return a url when found by its short code', async () => {
    const shortCode = 'abc1234';
    const expectedUrl = Url.create({
      id: 'url-id-123',
      originalUrl: 'https://example.com',
      shortCode: shortCode,
    } as Url);

    urlRepository.findByShortCode.mockResolvedValue(expectedUrl);

    const result = await useCase.execute(shortCode);

    expect(result).toEqual(expectedUrl);
    expect(urlRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
    expect(urlRepository.findByShortCode).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundException when the url is not found', async () => {
    const shortCode = 'not-found';
    urlRepository.findByShortCode.mockResolvedValue(undefined);

    await expect(useCase.execute(shortCode)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(shortCode)).rejects.toThrow(
      'Url register not found',
    );
  });
});
