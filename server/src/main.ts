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

  const port = process.env.PORT || 3001;
  logger.log(`Configuring application on port ${port}...`);

  // Add global prefix for API routes first
  app.setGlobalPrefix('api');
  logger.log('API routes configured with /api prefix');

  // Настройка CORS
  app.enableCors({
    origin: ['http://localhost:3002', 'https://web.telegram.org'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  logger.log('CORS enabled');

  // Start HTTP server immediately
  logger.log(`Starting HTTP server on port ${port}...`);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Health check available at: http://localhost:${port}/api/health`);

  // Wait a bit to ensure health check is available
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Initialize services after HTTP server is running
  logger.log('Initializing services...');
  const telegramService = app.get(TelegramService);

  // Start Telegram bot in the background
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
