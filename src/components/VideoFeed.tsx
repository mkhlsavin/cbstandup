import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Video } from '../types/Video';
import { UserFavorite } from '../types/UserFavorite';
import { getVideos, getFavorites } from '../services/api';
import { useTelegram } from '../context/TelegramContext';
import { VideoPlayer } from './VideoPlayer';
import { FavoriteButtonComponent } from './FavoriteButton';

const VideoFeedContainer = styled.div`
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

const VideoCardContainer = styled.div`
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

const VideoPlayerWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(rgba(0, 0, 0, 0.8), transparent);
  color: #fff;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
`;

const VideoInfo = styled.div`
  flex: 1;
  margin-right: 16px;
  pointer-events: none;
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

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

interface VideoCardProps {
  video: Video;
  initialIsFavorite: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, initialIsFavorite }) => {
  return (
    <VideoCardContainer>
      <VideoContainer>
        <VideoPlayerWrapper>
          <VideoPlayer
            videoUrl={video.url}
            controls={true}
            autoplay={false}
            onStatusChange={undefined}
            onError={undefined}
          />
        </VideoPlayerWrapper>
        <VideoOverlay>
          <VideoInfo>
            <VideoTag>{video.tag}</VideoTag>
            <VideoTitle>{video.title}</VideoTitle>
          </VideoInfo>
          <FavoriteButtonComponent
            videoId={video.id}
            videoTitle={video.title}
            initialIsFavorite={initialIsFavorite}
          />
        </VideoOverlay>
      </VideoContainer>
    </VideoCardContainer>
  );
};

const MemoizedVideoCard = React.memo(VideoCard);

export const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const telegramContext = useTelegram();
  const { user } = telegramContext;

  const loadFavorites = useCallback(async () => {
    if (user?.id) {
      try {
        const favoritesData = await getFavorites(user.id.toString());
        const favoriteIds = new Set<number>(favoritesData.map((fav: UserFavorite) => fav.video_id));
        setFavorites(favoriteIds);
      } catch (error) {
        // Обработка ошибки загрузки избранного
      }
    }
  }, [user?.id]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        // Обработка ошибки загрузки видео
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const memoizedVideos = useMemo(() => {
    return videos.map(video => (
      <MemoizedVideoCard key={video.id} video={video} initialIsFavorite={favorites.has(video.id)} />
    ));
  }, [videos, favorites]);

  return (
    <VideoFeedContainer>
      <VideoGrid>{memoizedVideos}</VideoGrid>
    </VideoFeedContainer>
  );
};
