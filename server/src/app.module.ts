import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './config/database';
import { Video } from './entities/Video';
import { UserFavorite } from './entities/UserFavorite';
import { VideoService } from './services/video.service';
import { OpenAIService } from './services/openai';
import { TelegramService } from './services/telegram';
import { VideoController } from './controllers/video.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
      retryAttempts: 3,
      retryDelay: 3000,
    }),
    TypeOrmModule.forFeature([Video, UserFavorite]),
  ],
  controllers: [AppController, VideoController],
  providers: [AppService, VideoService, OpenAIService, TelegramService],
  exports: [VideoService, OpenAIService, TelegramService],
})
export class AppModule {}
