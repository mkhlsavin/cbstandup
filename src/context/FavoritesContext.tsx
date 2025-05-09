import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { addToFavorites, removeFromFavorites, getFavorites } from '../services/api';
import { UserFavorite } from '../types/UserFavorite';

interface FavoritesContextType {
  favorites: Set<number>;
  toggleFavorite: (videoId: number, videoTitle: string, userId: string) => Promise<void>;
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
  userId: string;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
  initialFavorites,
  userId,
}) => {
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    if (process.env.NODE_ENV === 'development') {
      const savedFavorites = localStorage.getItem(`favorites_${userId}`);
      if (savedFavorites) {
        return new Set(JSON.parse(savedFavorites));
      }
    }
    return new Set(initialFavorites);
  });

  const handleToggleFavorite = useCallback(
    async (videoId: number, videoTitle: string, userId: string) => {
      // Оптимистичное обновление UI
      setFavorites(prevFavorites => {
        const newFavorites = new Set(prevFavorites);
        if (newFavorites.has(videoId)) {
          newFavorites.delete(videoId);
        } else {
          newFavorites.add(videoId);
        }
        // Сохраняем в localStorage в режиме разработки
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem(`favorites_${userId}`, JSON.stringify(Array.from(newFavorites)));
        }
        return newFavorites;
      });

      try {
        if (favorites.has(videoId)) {
          await removeFromFavorites(userId, videoId);
        } else {
          await addToFavorites(userId, videoId);
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
        setFavorites(prevFavorites => {
          const newFavorites = new Set(prevFavorites);
          if (!newFavorites.has(videoId)) {
            newFavorites.add(videoId);
          } else {
            newFavorites.delete(videoId);
          }
          // Сохраняем в localStorage в режиме разработки
          if (process.env.NODE_ENV === 'development') {
            localStorage.setItem(`favorites_${userId}`, JSON.stringify(Array.from(newFavorites)));
          }
          return newFavorites;
        });
      }
    },
    [favorites]
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
      const favoritesData = await getFavorites(userId);
      const newFavorites = new Set(favoritesData.map((fav: UserFavorite) => fav.video_id));
      setFavorites(newFavorites);
      // Сохраняем в localStorage в режиме разработки
      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(Array.from(newFavorites)));
      }
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
