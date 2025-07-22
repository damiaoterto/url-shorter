import { Url } from '@domain/url/entities/url.entity';
import { User } from '../entity/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract createNew(entity: User): Promise<void>;
  abstract addURL(email: string, url: Url): Promise<void>;
}
