import { INestApplication, Injectable } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Injectable()
export class OpenApiService {
  init(app: INestApplication) {
    const config = new DocumentBuilder().setTitle('Product Manager').build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, documentFactory);
  }
}
