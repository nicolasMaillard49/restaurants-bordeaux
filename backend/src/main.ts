import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS pour permettre les requêtes depuis le frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'https://restaurants-bordeaux.com',
      'https://www.restaurants-bordeaux.com',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend API running on: http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
}

bootstrap();
