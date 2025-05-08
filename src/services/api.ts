import axios from 'axios';
import { config } from '../config';
import { Video } from '../entities/Video';

const API_URL = config.api.baseUrl;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getAssistantResponse(message: string): Promise<string> {
  try {
    const response = await api.post('/api/assistant/chat', { message });
    return response.data.response;
  } catch (error) {
    console.error('Error getting assistant response:', error);
    throw error;
  }
}

export const getVideos = async (): Promise<Video[]> => {
  const response = await axios.get(`${API_URL}/videos`);
  return response.data;
};

export const getVideosByTag = async (tag: string): Promise<Video[]> => {
  const response = await api.get(`/videos/tag/${tag}`);
  return response.data;
};

export const getFavorites = async (userId: number): Promise<Video[]> => {
  const response = await axios.get(`${API_URL}/favorites/${userId}`);
  return response.data;
};

export const toggleFavorite = async (userId: number, videoId: number): Promise<void> => {
  await axios.post(`${API_URL}/favorites`, { userId, videoId });
};

export const removeFavorite = async (userId: number, videoId: number): Promise<void> => {
  await axios.delete(`${API_URL}/favorites/${userId}/${videoId}`);
};

export const isFavorite = async (userId: string, videoId: number): Promise<boolean> => {
  const response = await api.get(`/favorites/${userId}/${videoId}`);
  return response.data;
};
