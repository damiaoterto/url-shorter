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

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUseCase) {}

  @Post('login')
  async login() {
    // TODO
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
