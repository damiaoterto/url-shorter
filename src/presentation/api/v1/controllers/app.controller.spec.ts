import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AccessUrlUseCase } from '@application/url/usecases/access-url.usecase';
import { Url } from '@domain/url/entities/url.entity';
import { Response } from 'express';

describe('AppController', () => {
  let controller: AppController;
  let accessUrlUseCase: AccessUrlUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AccessUrlUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    accessUrlUseCase = module.get<AccessUrlUseCase>(AccessUrlUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirect', () => {
    it('should call the use case and redirect to the original URL', async () => {
      // Arrange
      const shortCode = 'abc1234';
      const expectedUrl = Url.create({
        originalUrl: 'https://example.com/redirect-path',
      } as Url);

      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(accessUrlUseCase, 'execute').mockResolvedValue(expectedUrl);

      await controller.redirect(mockResponse, shortCode);

      expect(accessUrlUseCase.execute).toHaveBeenCalledWith(shortCode);
      expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        302,
        expectedUrl.originalUrl,
      );
    });
  });
});
