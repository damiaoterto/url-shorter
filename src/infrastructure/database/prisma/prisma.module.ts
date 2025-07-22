import { DynamicModule } from '@nestjs/common';
import { createPrismaProvider } from './providers/create-prisma.provider';
import { PrismaService } from './services/prisma.service';
import { UserRepository } from '@domain/user/repository/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

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
      ],
      exports: [UserRepository],
    };
  }
}
