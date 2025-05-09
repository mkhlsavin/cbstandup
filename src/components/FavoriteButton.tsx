import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { addToFavorites, removeFromFavorites } from '../services/api';
import { useTelegram } from '../context/TelegramContext';

const FavoriteButtonWrapper = styled.div`
  pointer-events: auto;
`;

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  background: transparent;
  border: none;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 40px;
    height: 40px;
    fill: ${props => (props.$isFavorite ? '#ff4d4d' : '#fff')};
    transition: fill 0.2s;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

interface FavoriteButtonProps {
  videoId: number;
  videoTitle: string;
  initialIsFavorite: boolean;
}

export const FavoriteButtonComponent: React.FC<FavoriteButtonProps> = ({
  videoId,
  videoTitle,
  initialIsFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { user } = useTelegram();

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (!user?.id) {
        return;
      }

      // Оптимистичное обновление UI
      setIsFavorite(prev => !prev);

      try {
        if (isFavorite) {
          await removeFromFavorites(user.id.toString(), videoId);
        } else {
          await addToFavorites(user.id.toString(), videoId);
        }

        if (
          window.Telegram &&
          window.Telegram.WebApp &&
          typeof (window.Telegram.WebApp as { sendData?: (data: string) => void }).sendData ===
            'function'
        ) {
          (window.Telegram.WebApp as { sendData?: (data: string) => void }).sendData?.(
            `/ask ${videoTitle}`
          );
        }
      } catch (error) {
        // Откат состояния в случае ошибки
        setIsFavorite(prev => !prev);
      }
    },
    [user?.id, videoId, videoTitle, isFavorite]
  );

  return (
    <FavoriteButtonWrapper>
      <FavoriteButton $isFavorite={isFavorite} onClick={handleClick}>
        <svg viewBox="0 0 32 32">
          <path d="M16 29.35l-2.45-2.32C6.4 21.36 2 17.28 2 12.5 2 8.42 5.42 5 9.5 5c2.54 0 4.91 1.18 6.5 3.09C17.59 6.18 19.96 5 22.5 5 26.58 5 30 8.42 30 12.5c0 4.78-4.4 8.86-11.55 14.54L16 29.35z" />
        </svg>
      </FavoriteButton>
    </FavoriteButtonWrapper>
  );
};
