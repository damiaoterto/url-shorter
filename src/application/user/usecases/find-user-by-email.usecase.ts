import { UseCase } from '@shared/interfaces/usecase.interface';
import { User } from '@domain/user/entity/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@domain/user/repository/user.repository';

@Injectable()
export class FindUserByEmailUseCase implements UseCase<string, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const existsUser = await this.userRepository.findByEmail(email);

    if (!existsUser) {
      throw new NotFoundException('User not found');
    }

    return existsUser;
  }
}
