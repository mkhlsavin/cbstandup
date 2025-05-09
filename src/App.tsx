import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { TelegramProvider } from './context/TelegramContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { useTelegram } from './context/TelegramContext';
import { lightTheme, darkTheme } from './theme';
import { VideoFeed } from './components/VideoFeed';
import { Favorites } from './components/Favorites';
import { GlobalStyle } from './GlobalStyle';

const AppContent: React.FC = () => {
  const { user } = useTelegram();
  const initialFavorites: number[] = [];
  const { theme } = useTelegram();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <FavoritesProvider initialFavorites={initialFavorites} userId={user?.id?.toString() || '0'}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<VideoFeed />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  );
};

export default App;
