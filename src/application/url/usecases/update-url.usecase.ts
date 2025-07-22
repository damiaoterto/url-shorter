import { UseCase } from '@shared/interfaces/usecase.interface';
import { UpdateUrlDTO } from '../dto/update-url.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UrlRepository } from '@domain/url/repositories/url.repository';
import { UserRepository } from '@domain/user/repository/user.repository';
import { Url } from '@domain/url/entities/url.entity';

type UpdateUrlData = UpdateUrlDTO & { id: string; email: string };

@Injectable()
export class UpdateUrlUseCase implements UseCase<UpdateUrlData, void> {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ url, id, email }: UpdateUrlData): Promise<void> {
    const existsUrl = await this.urlRepository.findById(id);

    if (!existsUrl) {
      throw new NotFoundException('Url register not found');
    }

    const exisUser = await this.userRepository.findByEmail(email);

    if (!exisUser) {
      throw new UnauthorizedException('User not found');
    }

    const userHasUrl = exisUser.urls!.find((url) => url.id === existsUrl.id);

    if (!userHasUrl) {
      throw new UnauthorizedException('User not authorized to update url');
    }

    const updatedUrl = Url.create({ ...existsUrl, originalUrl: url! });
    await this.urlRepository.update(existsUrl.id!, updatedUrl);
  }
}
