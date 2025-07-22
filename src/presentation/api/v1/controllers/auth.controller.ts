import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDTO } from '@application/auth/dto/register-user.dto';
import { RegisterUseCase } from '@application/auth/usecase/register-user.usecase';
import { LoginUserUseCase } from '@application/auth/usecase/login-user.usecase';
import { LoginUserDTO } from '@application/auth/dto/login-user.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('login')
  async login(@Body() data: LoginUserDTO) {
    return await this.loginUserUseCase.execute(data);
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() data: RegisterUserDTO) {
    return await this.registerUserUseCase.execute(data);
  }

  @Get('user')
  async user() {
    // TODO
  }
}
