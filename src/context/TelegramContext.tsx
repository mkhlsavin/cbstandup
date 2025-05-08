import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramContextType {
  user: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  } | null;
  theme: 'light' | 'dark';
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  theme: 'light',
});

// Тестовые данные для локальной разработки
const TEST_USER = {
  id: 123456789,
  username: 'test_user',
  first_name: 'Test',
  last_name: 'User',
};

// Проверяем, находимся ли мы в режиме разработки
const isDevelopment = process.env.NODE_ENV === 'development';

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramContextType['user']>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    console.log('Telegram context effect running');
    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    // Get user data from initDataUnsafe
    const userData = WebApp.initDataUnsafe.user;
    console.log('Telegram WebApp user data:', userData);

    if (userData && userData.id) {
      console.log('Setting user from WebApp data:', userData);
      setUser(userData);
    } else if (isDevelopment) {
      console.log('Development mode: using test user data');
      setUser(TEST_USER);
    } else {
      console.log('No valid WebApp user data available');
      setUser(null);
    }

    // Set theme
    setTheme(WebApp.colorScheme === 'dark' ? 'dark' : 'light');

    // Listen for theme changes
    WebApp.onEvent('themeChanged', () => {
      setTheme(WebApp.colorScheme === 'dark' ? 'dark' : 'light');
    });
  }, []);

  console.log('Current Telegram context state:', { user, theme });

  return <TelegramContext.Provider value={{ user, theme }}>{children}</TelegramContext.Provider>;
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
