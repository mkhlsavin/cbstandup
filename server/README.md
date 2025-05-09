# Backend Structure

## Основные технологии

- NestJS как основной фреймворк
- TypeORM для работы с базой данных
- PostgreSQL как основная база данных
- OpenAI Assistants API для генерации вопросов
- Grammy для Telegram бота
- Winston для логирования

## Структура директорий

```
server/
├── src/
│   ├── controllers/     # Контроллеры API
│   ├── services/        # Бизнес-логика
│   ├── entities/        # Модели данных
│   ├── dto/            # Data Transfer Objects
│   ├── database/       # Миграции и инициализация БД
│   ├── tests/          # Тесты
│   └── logger.ts       # Конфигурация логгера
├── dist/               # Скомпилированные файлы
└── package.json        # Зависимости и скрипты
```

## API Endpoints

### Health Check
- `GET /api/health` - Проверка работоспособности сервера

### Videos
- `GET /api/videos` - Получение списка видео
- `GET /api/videos/tag/:tag` - Получение видео по тегу
- `GET /api/favorites/:userId` - Получение избранных видео пользователя
- `POST /api/favorites` - Добавление видео в избранное
- `DELETE /api/favorites/:userId/:videoId` - Удаление видео из избранного

## Интеграция с Telegram

Бот использует библиотеку Grammy для обработки команд и сообщений. Основные функции:
- Обработка команд `/start`, `/help`
- Отправка видео из базы данных
- Интеграция с OpenAI для генерации вопросов
- Управление избранными видео

## База данных

### Инициализация

1. Создайте базу данных:
```bash
createdb cbstandup
```

2. Запустите скрипт инициализации:
```bash
psql -d cbstandup -f src/database/init.sql
```

### Структура

- `videos` - таблица для хранения видео
- `user_favorites` - таблица для хранения избранных видео пользователей
- Индексы для оптимизации запросов

## Разработка

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка
```bash
npm run build
```

### Тесты
```bash
npm test
```

## Переменные окружения

Создайте файл `.env` в корневой директории сервера:

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
OPENAI_ASSISTANT_ID=your_assistant_id
```

## Логирование

Приложение использует Winston для логирования. Логи выводятся в консоль в формате JSON с уровнем:
- `debug` в режиме разработки
- `info` в production

## Тестирование

- Unit тесты: `npm test`
- E2E тесты: `npm run test:e2e`
- Тесты API: `npm run test:api` 