import { DynamicModule } from '@nestjs/common';
import {
  ConfigService as NestConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { ConfigService } from './services/config.service';
import jwtConfig from './configs/jwt.config';
import shorterConfig from './configs/shorter.config';

export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [NestConfigModule.forRoot({ load: [jwtConfig, shorterConfig] })],
      providers: [NestConfigService, ConfigService],
    };
  }

  static forFeature(): DynamicModule {
    return {
      global: true,
      module: ConfigModule,
      imports: [NestConfigModule],
      providers: [NestConfigService, ConfigService],
      exports: [ConfigService],
    };
  }
}
