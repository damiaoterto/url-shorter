import { Module } from '@nestjs/common';
import { RegisterUseCase } from '@application/auth/usecase/register-user.usecase';
import { AuthController } from '@presentation/api/v1/controllers/auth.controller';
import { InMemoryUserRepository } from '@domain/user/repository/in-memory.repository';
import { UserRepository } from '@domain/user/repository/user.repository';

@Module({
  providers: [
    { provide: UserRepository, useClass: InMemoryUserRepository },
    RegisterUseCase,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
