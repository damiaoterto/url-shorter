import { DynamicModule } from '@nestjs/common';
import { UserRepository } from '@domain/user/repository/user.repository';
import { UrlRepository } from '@domain/url/repositories/url.repository';
import { createPrismaProvider } from './providers/create-prisma.provider';
import { PrismaService } from './services/prisma.service';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaUrlRepository } from './repositories/prisma-url.repository';

export class PrismaModule {
  static forRoot(): DynamicModule {
    const prismaProvider = createPrismaProvider();

    return {
      global: true,
      module: PrismaModule,
      providers: [
        prismaProvider,
        PrismaService,
        { provide: UserRepository, useClass: PrismaUserRepository },
        { provide: UrlRepository, useClass: PrismaUrlRepository },
      ],
      exports: [UserRepository, UrlRepository],
    };
  }
}
