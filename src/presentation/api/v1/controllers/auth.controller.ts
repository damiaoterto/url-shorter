import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDTO } from '@application/auth/dto/register-user.dto';
import { RegisterUseCase } from '@application/auth/usecase/register-user.usecase';
import { LoginUserUseCase } from '@application/auth/usecase/login-user.usecase';
import { LoginUserDTO } from '@application/auth/dto/login-user.dto';
import { AuthGuard } from '@presentation/api/v1/guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { FindUserByEmailUseCase } from '@application/user/usecases/find-user-by-email.usecase';
import { Public } from '../decorators/is-public.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginUserDTO) {
    return await this.loginUserUseCase.execute(data);
  }

  @Post('register')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() data: RegisterUserDTO) {
    return await this.registerUserUseCase.execute(data);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  async user(@GetUser('email') email: string) {
    return await this.findUserByEmailUseCase.execute(email);
  }
}
