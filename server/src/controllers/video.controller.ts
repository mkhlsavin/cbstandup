import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { VideoTag } from '../types';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('videos')
  async getVideos() {
    try {
      return await this.videoService.getVideos();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch videos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('videos/tag/:tag')
  async getVideosByTag(@Param('tag') tag: string) {
    try {
      if (!Object.values(VideoTag).includes(tag as VideoTag)) {
        throw new HttpException('Invalid tag value', HttpStatus.BAD_REQUEST);
      }
      return await this.videoService.getVideosByTag(tag as VideoTag);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch videos by tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('favorites/:userId')
  async getUserFavorites(@Param('userId') userId: string) {
    try {
      return await this.videoService.getFavorites(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('favorites')
  @HttpCode(200)
  async addToFavorites(@Body() data: { userId: string; videoId: number }) {
    try {
      return await this.videoService.addToFavorites(data.userId, data.videoId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add to favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('favorites/:userId/:videoId')
  @HttpCode(204)
  async removeFromFavorites(@Param('userId') userId: string, @Param('videoId') videoId: number) {
    try {
      await this.videoService.removeFromFavorites(userId, videoId);
      return null;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to remove from favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
