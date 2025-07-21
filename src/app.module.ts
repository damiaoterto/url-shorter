import { Module } from '@nestjs/common';
import { AuthModule } from '@infrastructure/iac/auth.module';
import { OpenApiModule } from '@infrastructure/openapi/openapi.module';

@Module({
  imports: [OpenApiModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
