import { UrlRepository } from '@domain/url/repositories/url.repository';
import { UserRepository } from '@domain/user/repository/user.repository';
import { ConfigService } from '@infrastructure/config/services/config.service';
import { CreateNewUrlUseCase } from './create-new-url.usecase';
import { Url } from '@domain/url/entities/url.entity';

describe('CreateNewUrlUseCase', () => {
  let useCase: CreateNewUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    urlRepository = {
      createNew: jest.fn(),
      addURL: jest.fn(),
    } as any;
    userRepository = {
      addURL: jest.fn(),
    } as any;
    configService = {
      get: jest.fn(),
    };

    useCase = new CreateNewUrlUseCase(
      urlRepository,
      userRepository,
      configService as ConfigService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a short url for an anonymous user', async () => {
    const input = { url: 'https://example.com/very/long/url' };
    const baseUrl = 'http://localhost:3000';
    (configService.get as jest.Mock).mockReturnValue(baseUrl);
    urlRepository.createNew.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(configService.get).toHaveBeenCalledWith('shorter.baseURL');
    expect(urlRepository.createNew).toHaveBeenCalledWith(expect.any(Url));
    expect(userRepository.addURL).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Url);
    expect(result.originalUrl).toBe(input.url);
    expect(result.shortUrl).toBe(`${baseUrl}/${result.shortCode}`);
  });

  it('should create a short url and associate it with an authenticated user', async () => {
    const input = {
      url: 'https://another-example.com/long/path',
      email: 'user@example.com',
    };
    const baseUrl = 'http://short.url';
    (configService.get as jest.Mock).mockReturnValue(baseUrl);
    urlRepository.createNew.mockResolvedValue(undefined);
    userRepository.addURL.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(urlRepository.createNew).toHaveBeenCalledWith(expect.any(Url));
    expect(userRepository.addURL).toHaveBeenCalledTimes(1);
    expect(userRepository.addURL).toHaveBeenCalledWith(
      input.email,
      expect.any(Url),
    );
    expect(result.originalUrl).toBe(input.url);
  });
});
