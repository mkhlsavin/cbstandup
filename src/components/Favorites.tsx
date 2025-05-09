import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Video } from '../types/Video';
import { UserFavorite } from '../types/UserFavorite';
import { getFavorites, getVideos } from '../services/api';
import { useTelegram } from '../hooks/useTelegram';
import { VideoPlayer } from './VideoPlayer';

const FavoritesContainer = styled.div`
  padding: 16px;
  max-width: 100%;
  margin: 0 auto;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  justify-content: center;
`;

const VideoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  aspect-ratio: 9/16;
  max-width: 100%;

  &:hover {
    transform: translateY(-4px);
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: #fff;
`;

const VideoTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const VideoTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  margin-bottom: 8px;
  backdrop-filter: blur(4px);
`;

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Video[]>([]);
  const { user } = useTelegram();

  useEffect(() => {
    const loadFavorites = async () => {
      if (user?.id) {
        try {
          const favoritesData = await getFavorites(user.id.toString());
          const favoriteIds = new Set(favoritesData.map((fav: UserFavorite) => fav.video_id));
          const videos = await getVideos();
          const favoriteVideos = videos.filter((video: Video) => favoriteIds.has(video.id));
          setFavorites(favoriteVideos);
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    };

    loadFavorites();
  }, [user?.id]);

  return (
    <FavoritesContainer>
      <VideoGrid>
        {favorites.map(video => (
          <VideoCard key={video.id}>
            <VideoContainer>
              <VideoPlayer
                videoUrl={video.url}
                controls={true}
                autoplay={false}
                onError={(error: unknown) => console.error('Video player error:', error)}
              />
            </VideoContainer>
            <VideoInfo>
              <VideoTag>{video.tag}</VideoTag>
              <VideoTitle>{video.title}</VideoTitle>
            </VideoInfo>
          </VideoCard>
        ))}
      </VideoGrid>
    </FavoritesContainer>
  );
};
