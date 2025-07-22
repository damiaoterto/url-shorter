import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { UserRepository } from '@domain/user/repository/user.repository';
import { HashAlg } from '@infrastructure/crypt/algs/hash.alg';
import { Payload } from '@domain/auth/entities/payload.entity';
import { JwtToken } from '@domain/auth/entities/jwt-token.entity';
import { LoginUserDTO } from '../dto/login-user.dto';

@Injectable()
export class LoginUserUseCase implements UseCase<LoginUserDTO, JwtToken> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashAlg: HashAlg,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginUserDTO): Promise<JwtToken> {
    const existsUser = await this.userRepository.findByEmail(email);

    if (!existsUser) {
      throw new UnauthorizedException('Invalid e-mail or password');
    }

    const verifyHash = await this.hashAlg.verify(existsUser.password, password);

    if (!verifyHash) {
      throw new UnauthorizedException('Invalid e-mail or password');
    }

    const payload = Payload.create({
      sub: existsUser.id!,
      email: existsUser.email,
    });

    const accessToken = await this.jwtService.signAsync({ ...payload });

    return JwtToken.create({ accessToken });
  }
}
