import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { toggleFavorite, api } from '../services/api';
import { UserFavorite } from '../entities/UserFavorite';

interface FavoritesContextType {
  favorites: Set<number>;
  toggleFavorite: (videoId: number, videoTitle: string, userId: number) => Promise<void>;
  isFavorite: (videoId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
  initialFavorites: number[];
  userId: number;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
  initialFavorites,
  userId,
}) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set(initialFavorites));

  const handleToggleFavorite = useCallback(
    async (videoId: number, videoTitle: string, userId: number) => {
      // Оптимистичное обновление UI
      setFavorites(prevFavorites => {
        const newFavorites = new Set(prevFavorites);
        if (newFavorites.has(videoId)) {
          newFavorites.delete(videoId);
        } else {
          newFavorites.add(videoId);
        }
        return newFavorites;
      });

      try {
        await toggleFavorite(userId, videoId);

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
        setFavorites(prevFavorites => {
          const newFavorites = new Set(prevFavorites);
          if (!newFavorites.has(videoId)) {
            newFavorites.add(videoId);
          } else {
            newFavorites.delete(videoId);
          }
          return newFavorites;
        });
      }
    },
    []
  );

  const isFavorite = useCallback(
    (videoId: number) => {
      return favorites.has(videoId);
    },
    [favorites]
  );

  const loadFavorites = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await api.get('/videos/favorites');
      const favoritesData = response.data;
      setFavorites(new Set(favoritesData.map((fav: UserFavorite) => fav.video_id)));
    } catch (error) {
      // Handle error silently
    }
  }, [userId]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite: handleToggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
