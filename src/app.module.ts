import { Module } from '@nestjs/common';
import { OpenApiModule } from '@infrastructure/openapi/openapi.module';
import { ConfigModule } from '@infrastructure/config/config.module';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { AuthModule } from '@modules/auth.module';
import { UrlModule } from '@modules/url.module';
import { AppController } from '@presentation/api/v1/controllers/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    OpenApiModule,
    AuthModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
