# CBStandup

БиоХимия.Standup - это образовательная платформа, которая помогает в подготовке к ДВИ по химии и биологии. Приложение предоставляет доступ к видео-урокам и интерактивным тренажерам в формате Telegram Mini App и чатбота интегрированного с ИИ-ассистентом. Основная механика - смотреть короткие видео в ленте и при клике на кнопку Лайк в чат-боте можно пообщаться с ИИ по теме видеоурока, попрактиковаться в решении задач.

## Требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 17 или выше)
- PowerShell (для Windows) или Bash (для Linux/MacOS)

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
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
- Откроет два окна PowerShell для мониторинга логов

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
- Или закройте окна PowerShell, запущенные скриптом

### Linux/MacOS
- Нажмите Ctrl+C в терминале, где запущен скрипт `start.sh`
- Или используйте команду `pkill -f node` для остановки всех процессов Node.js

## Структура проекта

- `/src` - Исходный код фронтенда
- `/server` - Исходный код бэкенда
- `/public` - Статические файлы

Подробное описание структуры каждой директории можно найти в соответствующих README.md файлах:
- [Frontend Structure](src/README.md)
- [Backend Structure](server/README.md)

## Разработка

### Скрипты

- `npm run start:web` - Запуск фронтенда в режиме разработки
- `npm run build` - Сборка фронтенда
- `npm run test` - Запуск тестов
- `npm run lint` - Проверка кода линтером
- `npm run format` - Форматирование кода

### Серверные скрипты

- `cd server && npm run dev` - Запуск сервера в режиме разработки
- `cd server && npm run build` - Сборка сервера
- `cd server && npm run test` - Запуск тестов сервера

## Технологии

### Frontend
- React 18
- TypeScript
- Styled Components
- Telegram Web App SDK
- Framer Motion для анимаций
- React Router для навигации

### Backend
- NestJS
- TypeORM
- PostgreSQL
- OpenAI Assistants API
- Telegraf для Telegram бота

## Функциональность

- Авторизация через Telegram
- Просмотр видео-уроков
- Добавление видео в избранное
- Интерактивные тренажеры
- Интеграция с OpenAI для генерации вопросов
- Адаптивный дизайн для мобильных устройств

## Лицензия

MIT 

### Переменные окружения

#### Клиентская часть (.env в корневой директории)
```
REACT_APP_API_URL=http://localhost:3002
REACT_APP_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
REACT_APP_BOT_USERNAME=@cbstandup_bot
NODE_ENV=development
```

#### Серверная часть (.env в директории server)
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