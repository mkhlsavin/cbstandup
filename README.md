# CBStandup

БиоХимия.Standup - это образовательная платформа, которая помогает в подготовке к ДВИ по химии и биологии. Приложение предоставляет доступ к видео-урокам и интерактивным тренажерам в формате Telegram Mini App и чатбота интегрированного с ИИ-ассистентом. Основная механика - смотреть короткие видео в ленте и при клике на кнопку Лайк в чат-боте можно пообщаться с ИИ по теме видеоурока, попрактиковаться в решении задач.

## Требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 17 или выше)
- PowerShell (для Windows) или Bash (для Linux/MacOS)

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/mkhlsavin/cbstandup.git
cd cbstandup
```

2. Установите зависимости:
```bash
npm install
cd server
npm install
cd ..
```

## Запуск приложения

### Windows

Для запуска приложения на Windows используйте скрипт `start.ps1`:

```powershell
.\start.ps1
```

Скрипт выполнит следующие действия:
- Проверит и освободит необходимые порты (3001, 3002)
- Установит зависимости, если они отсутствуют
- Запустит сервер на порту 3001
- Запустит веб-приложение на порту 3002

### Linux/MacOS

Для запуска приложения на Linux или MacOS используйте скрипт `start.sh`:

```bash
chmod +x start.sh
./start.sh
```

## Доступ к приложению

После запуска приложение будет доступно по следующим адресам:
- Сервер: http://localhost:3001
- Веб-приложение: http://localhost:3002

## Остановка приложения

### Windows
- Нажмите Enter в окне, где запущен скрипт `start.ps1`

### Linux/MacOS
- Нажмите Ctrl+C в терминале, где запущен скрипт `start.sh`

## Структура проекта

- `/src` - Исходный код фронтенда
- `/server` - Исходный код бэкенда
- `/public` - Статические файлы

Подробное описание структуры каждой директории можно найти в соответствующих README.md файлах:
- [Frontend Structure](src/README.md)
- [Backend Structure](server/README.md)

## Разработка

### Скрипты

- `npm start` - Запуск фронтенда в режиме разработки
- `npm run build` - Сборка фронтенда
- `npm test` - Запуск тестов
- `npm run eject` - Извлечение конфигурации

### Серверные скрипты

- `cd server && npm run dev` - Запуск сервера в режиме разработки
- `cd server && npm run build` - Сборка сервера
- `cd server && npm test` - Запуск тестов сервера

## Технологии

### Frontend
- React 18
- TypeScript
- Styled Components
- Telegram Web App SDK
- React Router для навигации

### Backend
- NestJS
- TypeORM
- PostgreSQL
- OpenAI Assistants API
- Grammy для Telegram бота

## Функциональность

- Авторизация через Telegram
- Просмотр видео-уроков
- Добавление видео в избранное
- Интеграция с OpenAI для генерации вопросов
- Адаптивный дизайн для мобильных устройств

## Переменные окружения

### Клиентская часть (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

### Серверная часть (server/.env)
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

## Инициализация базы данных

1. Убедитесь, что у вас установлен и запущен PostgreSQL
2. Создайте базу данных:
   ```bash
   createdb cbstandup
   ```
3. Инициализируйте базу данных с помощью скрипта:
   ```bash
   psql -d cbstandup -f server/src/database/init.sql
   ```

## Лицензия

MIT 