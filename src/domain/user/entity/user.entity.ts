import { randomUUID } from 'node:crypto';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@shared/entities/base.entity';
import { EmailVO } from '../value-objects/email.vo';

export class User extends BaseEntity {
  name: string;
  email: string;
  @Exclude()
  password: string;

  static create(data: User): User {
    const user = new User();

    user.id = data.id ?? randomUUID().toString();
    user.name = data.name;
    user.email = new EmailVO(data.email).value;
    user.createdAt = data.createdAt ?? new Date();
    user.password = data.password;

    return user;
  }
}
