import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramTheme {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
  safeArea: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isLowPerformance: boolean;
}

const defaultTheme: TelegramTheme = {
  bg_color: '#ffffff',
  text_color: '#000000',
  hint_color: '#999999',
  link_color: '#2481cc',
  button_color: '#2481cc',
  button_text_color: '#ffffff',
  secondary_bg_color: '#f4f4f5',
  safeArea: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  isLowPerformance: false,
};

const TelegramThemeContext = createContext<TelegramTheme>(defaultTheme);

export const TelegramThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<TelegramTheme>(defaultTheme);

  useEffect(() => {
    if (WebApp.platform === 'unknown') {
      return;
    }

    const newTheme = {
      bg_color: WebApp.backgroundColor,
      text_color: WebApp.themeParams.text_color || defaultTheme.text_color,
      hint_color: WebApp.themeParams.hint_color,
      link_color: WebApp.themeParams.link_color,
      button_color: WebApp.themeParams.button_color,
      button_text_color: WebApp.themeParams.button_text_color,
      secondary_bg_color: WebApp.themeParams.secondary_bg_color,
      safeArea: {
        top: WebApp.viewportStableHeight - WebApp.viewportHeight,
        right: 0,
        bottom: 0,
        left: 0,
      },
      isLowPerformance: WebApp.platform === 'android',
    };

    setTheme(newTheme);
  }, []);

  return <TelegramThemeContext.Provider value={theme}>{children}</TelegramThemeContext.Provider>;
};

export const useTelegramTheme = () => useContext(TelegramThemeContext);

export default TelegramThemeContext;
