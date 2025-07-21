import { Module } from '@nestjs/common';
import { AuthModule } from '@infrastructure/iac/auth.module';
import { OpenApiModule } from '@infrastructure/openapi/openapi.module';
import { ConfigModule } from '@infrastructure/config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), OpenApiModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
