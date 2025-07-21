import { User } from '../entity/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract createNew(entity: User): Promise<void>;
}
