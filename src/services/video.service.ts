import { Video, VideoTag } from '../entities/Video';
import { config } from '../config';

export class VideoService {
  async getAllVideos(): Promise<Video[]> {
    const response = await fetch(`${config.api.baseUrl}/videos`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return response.json();
  }

  async getVideosByTag(tag: VideoTag): Promise<Video[]> {
    const response = await fetch(`${config.api.baseUrl}/videos/tag/${tag}`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos by tag');
    }
    return response.json();
  }

  async toggleFavorite(telegramUserId: string, videoId: number): Promise<void> {
    const response = await fetch(`${config.api.baseUrl}/favorites/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telegramUserId, videoId }),
    });
    if (!response.ok) {
      throw new Error('Failed to toggle favorite');
    }
  }

  async getFavorites(telegramUserId: string): Promise<Video[]> {
    const response = await fetch(`${config.api.baseUrl}/favorites/${telegramUserId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    return response.json();
  }

  async isFavorite(telegramUserId: string, videoId: number): Promise<boolean> {
    const response = await fetch(`${config.api.baseUrl}/favorites/check/${telegramUserId}/${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to check favorite status');
    }
    return response.json();
  }
}
