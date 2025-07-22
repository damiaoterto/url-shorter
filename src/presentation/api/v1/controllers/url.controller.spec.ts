import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { CreateNewUrlUseCase } from '@application/url/usecases/create-new-url.usecase';
import { UpdateUrlUseCase } from '@application/url/usecases/update-url.usecase';
import { DeleteUrlUseCase } from '@application/url/usecases/delete-url.usecase';
import { CreateNewUrlDTO } from '@application/url/dto/create-new-url.dto';
import { UpdateUrlDTO } from '@application/url/dto/update-url.dto';
import { Url } from '@domain/url/entities/url.entity';

describe('UrlController', () => {
  let controller: UrlController;
  let createNewUrlUseCase: CreateNewUrlUseCase;
  let updateUrlUseCase: UpdateUrlUseCase;
  let deleteUrlUseCase: DeleteUrlUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: CreateNewUrlUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateUrlUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteUrlUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    createNewUrlUseCase = module.get<CreateNewUrlUseCase>(CreateNewUrlUseCase);
    updateUrlUseCase = module.get<UpdateUrlUseCase>(UpdateUrlUseCase);
    deleteUrlUseCase = module.get<DeleteUrlUseCase>(DeleteUrlUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateNewUrlUseCase with DTO and user data', async () => {
      const createDto: CreateNewUrlDTO = { url: 'https://example.com' };
      const userData = { email: 'user@example.com' };
      const expectedUrl = Url.create({ originalUrl: createDto.url } as Url);
      jest.spyOn(createNewUrlUseCase, 'execute').mockResolvedValue(expectedUrl);

      const result = await controller.create(createDto, userData);

      expect(createNewUrlUseCase.execute).toHaveBeenCalledWith({
        ...createDto,
        ...userData,
      });
      expect(result).toEqual(expectedUrl);
    });
  });

  describe('update', () => {
    it('should call UpdateUrlUseCase with id, DTO, and user email', async () => {
      const urlId = 'url-id-123';
      const updateDto: UpdateUrlDTO = { url: 'https://new-example.com' };
      const userEmail = 'user@example.com';
      jest.spyOn(updateUrlUseCase, 'execute').mockResolvedValue(undefined);

      await controller.update(urlId, updateDto, userEmail);

      expect(updateUrlUseCase.execute).toHaveBeenCalledWith({
        ...updateDto,
        id: urlId,
        email: userEmail,
      });
    });
  });

  describe('delete', () => {
    it('should call DeleteUrlUseCase with id and user email', async () => {
      // Arrange
      const urlId = 'url-id-123';
      const userEmail = 'user@example.com';
      jest.spyOn(deleteUrlUseCase, 'execute').mockResolvedValue(undefined);

      await controller.delete(urlId, userEmail);

      expect(deleteUrlUseCase.execute).toHaveBeenCalledWith({
        id: urlId,
        email: userEmail,
      });
    });
  });
});
