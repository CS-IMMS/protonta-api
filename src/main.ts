import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import * as responseTime from 'response-time';
import { AppModule } from './app.module';
import { validationError } from './core/shared/filters/validation.errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use((req, res, next) => {
    res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return validationError(errors);
      },
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, sentry-trace',
    credentials: false,
  });
  const config = new DocumentBuilder()
    .setTitle('Sensor API')
    .setDescription(
      'API for managing sensor data, including WebSocket connections',
    )
    .setVersion('1.0')
    .addServer(`${process.env.IP_PROTENTA}:${process.env.PORT}`)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useLogger(app.get(Logger));
  app.use(responseTime());
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
