import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../entities/Video';
import { UserFavorite } from '../entities/UserFavorite';
import { VideoTag } from '../types/enums';
import { Logger } from '@nestjs/common';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(UserFavorite)
    private readonly userFavoriteRepository: Repository<UserFavorite>,
  ) {}

  async getVideos(): Promise<Video[]> {
    return this.videoRepository.find();
  }

  async getVideosByTag(tag: VideoTag): Promise<Video[]> {
    return this.videoRepository.find({ where: { tag } });
  }

  async getVideoById(id: number): Promise<Video | null> {
    try {
      this.logger.log(`Fetching video with ID: ${id}`);
      const video = await this.videoRepository.findOne({ where: { id } });
      this.logger.log(`Video found: ${video ? 'yes' : 'no'}`);
      if (video) {
        this.logger.log(`Video details: ${JSON.stringify(video)}`);
      }
      return video;
    } catch (error) {
      this.logger.error(`Error fetching video ${id}:`, error);
      throw error;
    }
  }

  async getFavorites(userId: string): Promise<Video[]> {
    const favorites = await this.userFavoriteRepository.find({
      where: { telegram_user_id: userId },
      relations: ['video'],
    });
    return favorites.map(favorite => favorite.video);
  }

  async addToFavorites(userId: string, videoId: number): Promise<UserFavorite | null> {
    // Проверяем, существует ли уже такая запись
    const existingFavorite = await this.userFavoriteRepository.findOne({
      where: {
        telegram_user_id: userId,
        video_id: videoId,
      },
    });

    if (existingFavorite) {
      return existingFavorite;
    }

    const favorite = this.userFavoriteRepository.create({
      telegram_user_id: userId,
      video_id: videoId,
    });
    return this.userFavoriteRepository.save(favorite);
  }

  async removeFromFavorites(userId: string, videoId: number): Promise<void> {
    const favorite = await this.userFavoriteRepository.findOne({
      where: {
        telegram_user_id: userId,
        video_id: videoId,
      },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite not found for user ${userId} and video ${videoId}`);
    }

    await this.userFavoriteRepository.remove(favorite);
  }

  async toggleFavorite(telegramUserId: string, videoId: number): Promise<void> {
    const favorite = await this.userFavoriteRepository.findOne({
      where: {
        telegram_user_id: telegramUserId,
        video_id: videoId,
      },
    });

    if (favorite) {
      await this.userFavoriteRepository.remove(favorite);
    } else {
      const newFavorite = this.userFavoriteRepository.create({
        telegram_user_id: telegramUserId,
        video_id: videoId,
      });
      await this.userFavoriteRepository.save(newFavorite);
    }
  }

  async isFavorite(telegramUserId: string, videoId: number): Promise<boolean> {
    const favorite = await this.userFavoriteRepository.findOne({
      where: {
        telegram_user_id: telegramUserId,
        video_id: videoId,
      },
    });
    return !!favorite;
  }

  async initializeVideos(videos: Video[]): Promise<void> {
    await this.videoRepository.clear();
    await this.videoRepository.save(videos);
  }
}
