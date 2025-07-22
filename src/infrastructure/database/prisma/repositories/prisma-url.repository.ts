import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';
import { Url } from '@domain/url/entities/url.entity';
import {
  UrlRepository,
  UrlUpdateData,
} from '@domain/url/repositories/url.repository';

@Injectable()
export class PrismaUrlRepository implements UrlRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findByShortCode(shortCode: string): Promise<Url | undefined> {
    const existsUrl = await this.prismaClient.url.findUnique({
      where: { shortCode },
    });

    if (!existsUrl) return undefined;

    return Url.create({
      ...existsUrl,
      clicks: Number.parseInt(existsUrl.clicks.toString()),
    });
  }

  async findById(id: string): Promise<Url | undefined> {
    const existsUrl = await this.prismaClient.url.findUnique({
      where: { id },
    });

    if (!existsUrl) return undefined;

    return Url.create({
      ...existsUrl,
      clicks: Number.parseInt(existsUrl.clicks.toString()),
    });
  }

  async update(id: string, data: UrlUpdateData): Promise<void> {
    await this.prismaClient.url.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaClient.url.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createNew(entity: Url): Promise<void> {
    await this.prismaClient.url.create({
      data: {
        id: entity.id!,
        originalUrl: entity.originalUrl,
        shortUrl: entity.shortUrl!,
        clicks: entity.clicks,
        shortCode: entity.shortCode!,
        createdAt: entity.createdAt!,
      },
    });
  }
}
