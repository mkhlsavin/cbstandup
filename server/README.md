# Backend Structure

## Директории

### `/src`
Основной код сервера:
- `main.ts` - Точка входа приложения
- `app.module.ts` - Корневой модуль NestJS

### `/src/controllers`
Контроллеры API:
- `video.controller.ts` - Управление видео
- `favorite.controller.ts` - Управление избранным

### `/src/services`
Сервисы:
- `telegram.service.ts` - Интеграция с Telegram
- `openai.service.ts` - Интеграция с OpenAI

### `/src/database`
Работа с базой данных:
- `init.sql` - Скрипт инициализации базы данных
- `migrations/` - Миграции базы данных

### `/src/entities`
Сущности базы данных:
- `Video.ts` - Модель видео
- `UserFavorite.ts` - Модель избранного

## Основные технологии

- NestJS
- TypeORM
- PostgreSQL
- OpenAI Assistants API
- Grammy для Telegram бота

## API Endpoints

### Видео
- `GET /videos` - Получение списка видео
- `GET /videos/:id` - Получение видео по ID
- `GET /videos/tag/:tag` - Получение видео по тегу

### Избранное
- `GET /favorites/:userId` - Получение избранных видео пользователя
- `POST /favorites/:userId/:videoId` - Добавление видео в избранное
- `DELETE /favorites/:userId/:videoId` - Удаление видео из избранного

## Интеграция с Telegram

- Обработка команд бота
- Интеграция с OpenAI для генерации вопросов
- Управление сессиями пользователей

## База данных

### Таблицы
- `videos` - Хранение информации о видео
- `user_favorites` - Связь пользователей с избранными видео

### Индексы
- `videos_tag_idx` - Индекс по тегу видео
- `user_favorites_user_id_idx` - Индекс по ID пользователя
- `user_favorites_video_id_idx` - Индекс по ID видео

## Разработка

### Скрипты
- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка проекта
- `npm run start:prod` - Запуск в production режиме
- `npm run test` - Запуск тестов
- `npm run lint` - Проверка кода

### Переменные окружения
```
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=cbstandup

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```

## Инициализация базы данных

1. Создайте базу данных:
   ```bash
   createdb cbstandup
   ```

2. Запустите скрипт инициализации:
   ```bash
   psql -d cbstandup -f src/database/init.sql
   ```

## Логирование

- Используется встроенный логгер NestJS
- Уровни логирования: error, warn, log, debug, verbose
- Логи сохраняются в файл в production режиме 