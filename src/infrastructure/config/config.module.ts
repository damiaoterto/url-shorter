import { DynamicModule } from '@nestjs/common';
import {
  ConfigService as NestConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { ConfigService } from './services/config.service';
import jwtConfig from './configs/jwt.config';

export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      imports: [NestConfigModule.forRoot({ load: [jwtConfig] })],
      providers: [NestConfigService, ConfigService],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [NestConfigModule],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
