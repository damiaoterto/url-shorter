import { Injectable } from '@nestjs/common';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { PrismaClient } from '@generated/prisma';
import { Url } from '@domain/url/entities/url.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const existsUser = await this.prismaClient.user.findUnique({
      where: { email },
      include: { urls: true },
    });

    if (!existsUser) return undefined;

    return User.create({
      ...existsUser,
      urls: existsUser.urls.map((url) =>
        Url.create({ ...url, clicks: Number.parseInt(url.clicks.toString()) }),
      ),
    });
  }

  async addURL(email: string, url: Url): Promise<void> {
    await this.prismaClient.user.update({
      where: { email },
      data: {
        urls: { connect: { id: url.id } },
      },
    });
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
