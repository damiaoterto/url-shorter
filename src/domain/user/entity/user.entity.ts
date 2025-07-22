import { randomUUID } from 'node:crypto';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@shared/entities/base.entity';
import { EmailVO } from '../value-objects/email.vo';
import { Url } from '@domain/url/entities/url.entity';

export class User extends BaseEntity {
  name: string;
  email: string;
  @Exclude()
  password: string;

  urls?: Url[];

  static create(data: User): User {
    const user = new User();

    user.id = data.id ?? randomUUID().toString();
    user.name = data.name;
    user.email = new EmailVO(data.email).value;
    user.urls = data.urls ?? [];
    user.createdAt = data.createdAt ?? new Date();
    user.password = data.password;

    return user;
  }
}
