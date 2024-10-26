import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Sensor API')
    .setDescription(
      'API for managing sensor data, including WebSocket connections',
    )
    .setVersion('1.0')
    .addTag(
      'WebSocket',
      'Use ws://localhost:3001/sensor for WebSocket connections',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000);
}
bootstrap();
