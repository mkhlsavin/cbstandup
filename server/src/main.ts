import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { TelegramService } from './services/telegram';

async function bootstrap() {
  const logger = new Logger('Main');
  logger.log('Starting application...');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const port = process.env.PORT || '3001';
  logger.log(`Configuring application on port ${port}...`);

  // Настройка CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  logger.log('CORS enabled');

  // Start HTTP server
  logger.log(`Starting HTTP server on port ${port}...`);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);

  // Initialize services
  logger.log('Initializing services...');
  const telegramService = app.get(TelegramService);

  // Start Telegram bot
  logger.log('Starting Telegram service...');
  telegramService.start().catch(error => {
    logger.error('Failed to start Telegram service:', error);
    logger.warn('Continuing without Telegram service...');
  });
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
