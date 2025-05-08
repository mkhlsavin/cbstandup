import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
//import { TelegramService } from './services/telegram';

async function bootstrap() {
  const logger = new Logger('Main');
  logger.log('Starting application...');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const port = process.env.PORT || '10000';
  logger.log(`Configuring application on port ${port}...`);

  // Настройка CORS
  app.enableCors({
    origin: true, // Allow all origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  logger.log('CORS enabled');

  // Add a small delay to ensure the application is ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Start HTTP server immediately
  logger.log(`Starting HTTP server on port ${port}...`);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Health check available at: http://localhost:${port}/health`);

  // Initialize services after HTTP server is running
  logger.log('Initializing services...');
  //const telegramService = app.get(TelegramService);

  // Start Telegram bot in the background
  //logger.log('Starting Telegram service...');
  //telegramService.start().catch(error => {
  //  logger.error('Failed to start Telegram service:', error);
  //  logger.warn('Continuing without Telegram service...');
  //});
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
