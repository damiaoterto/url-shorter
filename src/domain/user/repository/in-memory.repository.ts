import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../entity/user.entity';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async createNew(entity: User): Promise<void> {
    this.users.push(entity);
  }
}
