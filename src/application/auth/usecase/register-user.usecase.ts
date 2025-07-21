import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { User } from '@domain/user/entity/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { HashAlg } from '@infrastructure/crypt/algs/hash.alg';
import { RegisterUserDTO } from '../dto/register-user.dto';

@Injectable()
export class RegisterUseCase implements UseCase<RegisterUserDTO, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashAlg: HashAlg,
  ) {}

  async execute({ name, email, password }: RegisterUserDTO): Promise<User> {
    const existsUser = await this.userRepository.findByEmail(email);

    if (existsUser) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.hashAlg.hash(password);
    const user = User.create({
      name,
      email,
      password: passwordHash,
    });

    await this.userRepository.createNew(user);

    return user;
  }
}
