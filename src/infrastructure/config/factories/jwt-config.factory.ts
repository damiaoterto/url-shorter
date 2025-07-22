import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '../services/config.service';
import { ConfigModule } from '../config.module';

export const jwtConfigFactory = (): JwtModuleAsyncOptions => ({
  imports: [ConfigModule.forFeature()],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
  }),
});
