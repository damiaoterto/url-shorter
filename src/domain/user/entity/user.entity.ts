import { BaseEntity } from '@shared/entities/base.entity';
import { Exclude } from 'class-transformer';
import { EmailVO } from '../value-objects/email.vo';

export class User extends BaseEntity {
  name: string;
  email: string;
  @Exclude()
  password: string;

  static create(data: User): User {
    const user = new User();

    user.name = data.name;
    user.email = new EmailVO(data.email).value;
    user.createdAt = data.createdAt ?? new Date();
    user.password = data.password;

    return user;
  }
}
