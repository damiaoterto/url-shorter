import { Module } from '@nestjs/common';
import { AuthModule } from '@infrastructure/iac/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
