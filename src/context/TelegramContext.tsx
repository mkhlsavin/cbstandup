import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramContextType {
  user: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    language_code: string;
  } | null;
  theme: 'light' | 'dark';
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  theme: 'light',
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramContextType['user']>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const initTelegram = async () => {
      if (window.Telegram?.WebApp) {
        const userData = window.Telegram.WebApp.initDataUnsafe?.user;
        if (userData) {
          setUser({
            id: userData.id,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            username: userData.username || '',
            language_code: 'en',
          });
        } else if (process.env.NODE_ENV === 'development') {
          setUser({
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'en',
          });
        }
      }
    };

    initTelegram();
  }, []);

  useEffect(() => {
    // Initialize Telegram WebApp only once
    if (window.Telegram?.WebApp) {
      WebApp.ready();
      WebApp.expand();

      // Set theme
      setTheme(WebApp.colorScheme === 'dark' ? 'dark' : 'light');

      // Listen for theme changes
      WebApp.onEvent('themeChanged', () => {
        setTheme(WebApp.colorScheme === 'dark' ? 'dark' : 'light');
      });
    }
  }, []);

  return <TelegramContext.Provider value={{ user, theme }}>{children}</TelegramContext.Provider>;
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
