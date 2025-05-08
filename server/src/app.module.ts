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
import { SupabaseService } from './services/supabase.service';

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
  controllers: [VideoController],
  providers: [VideoService, OpenAIService, TelegramService, SupabaseService],
  exports: [VideoService, OpenAIService, TelegramService, SupabaseService],
})
export class AppModule {}
