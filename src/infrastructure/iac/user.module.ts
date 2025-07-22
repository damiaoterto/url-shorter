import { Module } from '@nestjs/common';
import { FindUserByEmailUseCase } from '@application/user/usecases/find-user-by-email.usecase';

@Module({
  providers: [FindUserByEmailUseCase],
  exports: [FindUserByEmailUseCase],
})
export class UserModule {}
