import { UrlRepository } from '@domain/url/repositories/url.repository';
import { UserRepository } from '@domain/user/repository/user.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';

type DeleteData = { email: string; id: string };

@Injectable()
export class DeleteUrlUseCase implements UseCase<DeleteData, void> {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ id, email }: DeleteData): Promise<void> {
    const exitsUser = await this.userRepository.findByEmail(email);

    if (!exitsUser) {
      throw new UnauthorizedException('User not found');
    }

    const existsUrl = await this.urlRepository.findById(id);

    if (!existsUrl) {
      throw new NotFoundException('Url register not found');
    }

    const userHasUrl = exitsUser.urls!.find((url) => url.id === existsUrl.id);

    if (!userHasUrl) {
      throw new UnauthorizedException('User not authorized to delete this url');
    }

    await this.urlRepository.delete(existsUrl.id!);
  }
}
