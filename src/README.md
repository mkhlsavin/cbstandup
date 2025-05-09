# Frontend Structure

## Директории

### `/components`
Основные компоненты React:
- `VideoFeed.tsx` - Лента видео
- `VideoPlayer.tsx` - Плеер для видео (интеграция с Yandex Video Player)
- `FavoriteButton.tsx` - Кнопка добавления в избранное
- `Favorites.tsx` - Страница избранных видео

### `/context`
React контексты:
- `TelegramContext.tsx` - Контекст для работы с Telegram WebApp
- `FavoritesContext.tsx` - Контекст для управления избранными видео

### `/services`
Сервисы для работы с API:
- `api.ts` - Методы для взаимодействия с бэкендом

### `/types`
TypeScript типы:
- `Video.ts` - Типы для видео
- `UserFavorite.ts` - Типы для избранных видео

### `/hooks`
Кастомные React хуки:
- `useTelegram.ts` - Хук для работы с Telegram WebApp

## Основные технологии

- React 18
- TypeScript
- Styled Components для стилизации
- Telegram Web App SDK
- Yandex Video Player SDK

## Структура компонентов

### VideoFeed
- Отображает сетку видео
- Управляет состоянием загрузки видео
- Интегрируется с FavoritesContext

### VideoPlayer
- Интеграция с Yandex Video Player
- Управление состоянием воспроизведения
- Обработка ошибок

### Favorites
- Отображение избранных видео
- Интеграция с FavoritesContext
- Управление состоянием загрузки

## Стилизация

Проект использует Styled Components для стилизации. Основные стили:
- Адаптивная сетка для видео
- Анимации при наведении
- Градиентные оверлеи для информации о видео
- Адаптивный дизайн для мобильных устройств

## Интеграция с Telegram

- Авторизация через Telegram WebApp
- Получение данных пользователя
- Отправка сообщений в чат-бот
- Поддержка тем Telegram

## Разработка

### Скрипты
- `npm run start` - Запуск в режиме разработки
- `npm run build` - Сборка проекта
- `npm run test` - Запуск тестов
- `npm run lint` - Проверка кода

### Переменные окружения
```
REACT_APP_API_URL=http://localhost:3001
NODE_ENV=development
```
