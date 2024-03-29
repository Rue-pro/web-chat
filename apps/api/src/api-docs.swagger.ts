import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const PREFIX = process.env.GLOBAL_PREFIX ?? '';

  const config = new DocumentBuilder()
    .setTitle('Chat REST API')
    .setDescription('This is chat REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${PREFIX}/docs`, app, document);
}
