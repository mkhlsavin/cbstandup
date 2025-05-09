import { Video } from '../types/Video';
import { UserFavorite } from '../types/UserFavorite';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getVideos = async (): Promise<Video[]> => {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }
    return response.json();
};

export const getVideosByTag = async (tag: string): Promise<Video[]> => {
    const response = await fetch(`${API_BASE_URL}/videos/tag/${tag}`);
    if (!response.ok) {
        throw new Error('Failed to fetch videos by tag');
    }
    return response.json();
};

export const getFavorites = async (userId: string): Promise<UserFavorite[]> => {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch favorites');
    }
    return response.json();
};

export const addToFavorites = async (userId: string, videoId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, videoId }),
    });
    if (!response.ok) {
        throw new Error('Failed to add to favorites');
    }
};

export const removeFromFavorites = async (userId: string, videoId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${videoId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to remove from favorites');
    }
}; 