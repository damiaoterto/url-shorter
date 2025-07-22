import { Injectable } from '@nestjs/common';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { PrismaClient } from '@generated/prisma';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const existsUser = await this.prismaClient.user.findUnique({
      where: { email },
    });

    if (!existsUser) return undefined;

    return User.create(existsUser);
  }

  async createNew(entity: User): Promise<void> {
    await this.prismaClient.user.create({
      data: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        password: entity.password,
        createdAt: entity.createdAt!,
      },
    });
  }
}
