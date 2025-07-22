import { randomBytes, randomUUID } from 'node:crypto';
import { BaseEntity } from '@shared/entities/base.entity';
import { PropertiesOnly } from '@shared/types/properties-only.type';

export class Url extends BaseEntity {
  originalUrl: string;
  shortCode?: string;
  clicks: number;
  deletedAt?: Date | null;

  incrementClick(): void {
    this.clicks++;
  }

  private generateShortCode(length = 7): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  static create(data: PropertiesOnly<Url>): Url {
    const url = new Url();

    url.id = data.id ?? randomUUID().toString();
    url.originalUrl = data.originalUrl;
    url.shortCode = data.shortCode ?? url.generateShortCode();
    url.clicks = data.clicks ?? 0;
    url.createdAt = data.createdAt ?? new Date();
    url.updatedAt = data.updatedAt ?? null;
    url.deletedAt = data.deletedAt ?? null;

    return url;
  }
}
