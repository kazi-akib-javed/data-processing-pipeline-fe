import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  app.setGlobalPrefix('api');
  const logger = new Logger('Data Processing Pipeline');
  logger.log(`Server is running on port ${process.env.PORT ?? 4200}`);
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
