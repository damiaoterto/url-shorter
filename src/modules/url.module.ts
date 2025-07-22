import { Module } from '@nestjs/common';
import { CreateNewUrlUseCase } from '@application/url/usecases/create-new-url.usecase';
import { UrlController } from '@presentation/api/v1/controllers/url.controller';
import { ConfigModule } from '@infrastructure/config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { DeleteUrlUseCase } from '@application/url/usecases/delete-url.usecase';
import { UpdateUrlUseCase } from '@application/url/usecases/update-url.usecase';
import { AccessUrlUseCase } from '@application/url/usecases/access-url.usecase';

@Module({
  imports: [ConfigModule.forFeature(), JwtModule],
  providers: [
    CreateNewUrlUseCase,
    DeleteUrlUseCase,
    UpdateUrlUseCase,
    AccessUrlUseCase,
  ],
  exports: [AccessUrlUseCase],
  controllers: [UrlController],
})
export class UrlModule {}
