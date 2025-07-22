import { Injectable } from '@nestjs/common';
import { UrlRepository, UrlUpdateData } from './url.repository';
import { Url } from '../entities/url.entity';

@Injectable()
export class InMemoryRepository implements UrlRepository {
  private urls: Url[] = [];

  async findByShortCode(code: string): Promise<Url | undefined> {
    return this.urls.find((url) => url.shortCode === code);
  }

  async findById(id: string): Promise<Url | undefined> {
    return this.urls.find((url) => url.id === id);
  }

  async update(id: string, data: UrlUpdateData): Promise<void> {
    const existsUrl = await this.findById(id);

    if (!existsUrl) {
      throw new Error('Url register not found');
    }

    const updatedUrl = Url.create({
      ...existsUrl,
      ...data,
    });

    const filterUrls = this.urls.filter((url) => url.id !== id);

    this.urls = [...filterUrls, updatedUrl];
  }

  async delete(id: string): Promise<void> {
    const existsUrl = await this.findById(id);

    if (!existsUrl) {
      throw new Error('Url register not found');
    }

    this.urls = this.urls.filter((url) => url.id !== existsUrl.id);
  }

  async createNew(entity: Url): Promise<void> {
    const url = Url.create(entity);
    this.urls.push(url);
  }
}
