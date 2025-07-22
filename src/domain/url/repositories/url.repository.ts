import { BaseRepository } from '@shared/repositories/base.repository';
import { Url } from '../entities/url.entity';

export type UrlUpdateData = Omit<
  Partial<Url>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;

export abstract class UrlRepository extends BaseRepository<Url> {
  abstract findByShortCode(code: string): Promise<Url | undefined>;
  abstract findById(id: string): Promise<Url | undefined>;
  abstract update(id: string, data: UrlUpdateData): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
