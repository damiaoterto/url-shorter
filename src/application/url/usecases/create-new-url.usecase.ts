import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/interfaces/usecase.interface';
import { Url } from '@domain/url/entities/url.entity';
import { UrlRepository } from '@domain/url/repositories/url.repository';
import { ConfigService } from '@infrastructure/config/services/config.service';
import { UserRepository } from '@domain/user/repository/user.repository';
import { CreateNewUrlDTO } from '../dto/create-new-url.dto';

type ReqUserData = { email?: string; id?: string };
type CreateNewUrlData = CreateNewUrlDTO & ReqUserData;

@Injectable()
export class CreateNewUrlUseCase implements UseCase<CreateNewUrlData, Url> {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute({ url: originalUrl, email }: CreateNewUrlData): Promise<Url> {
    const url = Url.create({ originalUrl, clicks: 0 });

    const baseUrl = this.configService.get<string>('shorter.baseURL');
    url.shortUrl = `${baseUrl}/${url.shortCode!}`;

    await this.urlRepository.createNew(url);

    if (email) {
      await this.userRepository.addURL(email, url);
    }

    return url;
  }
}
