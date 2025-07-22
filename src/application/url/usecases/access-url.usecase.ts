import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { Url } from '@domain/url/entities/url.entity';
import { UrlRepository } from '@domain/url/repositories/url.repository';

@Injectable()
export class AccessUrlUseCase implements UseCase<string, Url> {
  constructor(private readonly urlRepository: UrlRepository) {}

  async execute(code: string): Promise<Url> {
    const existsUrl = await this.urlRepository.findByShortCode(code);

    if (!existsUrl) {
      throw new NotFoundException('Url register not found');
    }

    existsUrl.incrementClick();
    await this.urlRepository.update(existsUrl.id!, existsUrl);
    return existsUrl;
  }
}
