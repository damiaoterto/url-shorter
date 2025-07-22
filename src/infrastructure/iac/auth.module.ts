import { Module } from '@nestjs/common';
import { RegisterUseCase } from '@application/auth/usecase/register-user.usecase';
import { AuthController } from '@presentation/api/v1/controllers/auth.controller';
import { CryptModule } from '@infrastructure/crypt/crypt.module';
import { Argon2Alg } from '@infrastructure/crypt/algs/argon2.alg';
import { LoginUserUseCase } from '@application/auth/usecase/login-user.usecase';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigFactory } from '@infrastructure/config/factories/jwt-config.factory';

@Module({
  imports: [
    CryptModule.forFeature(Argon2Alg),
    JwtModule.registerAsync(jwtConfigFactory()),
  ],
  providers: [LoginUserUseCase, RegisterUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
