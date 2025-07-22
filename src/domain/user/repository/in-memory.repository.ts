import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../entity/user.entity';
import { Url } from '@domain/url/entities/url.entity';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async addURL(email: string, url: Url): Promise<void> {
    const existsUser = await this.findByEmail(email);

    if (!existsUser) {
      throw new Error('User register not found');
    }

    existsUser.urls = !existsUser.urls ? [url] : [...existsUser.urls, url];

    const filterUsers = this.users.filter((user) => user.id !== existsUser.id);
    this.users = [...filterUsers, existsUser];
  }

  async createNew(entity: User): Promise<void> {
    this.users.push(entity);
  }
}
