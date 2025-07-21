import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { OpenApiService } from '@infrastructure/openapi/services/openapi.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  app.enableShutdownHooks();
  app.enableVersioning({ type: VersioningType.URI });

  const openApiService = app.get(OpenApiService);

  openApiService.init(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
