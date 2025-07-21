import { Module } from '@nestjs/common';
import { AuthModule } from '@infrastructure/iac/auth.module';
import { OpenApiModule } from '@infrastructure/openapi/openapi.module';
import { ConfigModule } from '@infrastructure/config/config.module';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    OpenApiModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
