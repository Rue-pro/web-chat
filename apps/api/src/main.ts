import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from 'fastify-multipart';
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';

import { AppModule } from './app.module';
import { setupSwagger } from './api-docs.swagger';
import { GlobalExceptionFilter } from './error/global.exception.filter';

const isProd = process.env.DATABASE_URL;
const PREFIX = process.env.GLOBAL_PREFIX ?? '';

const whitelist = isProd
  ? [
      'https://chat-swart.vercel.app',
      undefined,
      'https://still-basin-01257.herokuapp.com',
    ]
  : ['http://localhost:5000', undefined, 'http://localhost:3000'];
const port = process.env.PORT ?? 5000;
const host = process.env.HOST ?? '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.setGlobalPrefix(PREFIX);

  app.enableCors({
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    ],
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.register(fastifyCookie, {
    secret: 'my-secret',
    parseOptions: {},
  } as FastifyCookieOptions);
  app.register(fastifyMultipart);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app);

  await app.listen(port, host);
}
bootstrap();
