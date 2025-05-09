#!/bin/bash

# Проверка и освобождение портов
for port in 3001 3002; do
    if lsof -i :$port > /dev/null; then
        echo "Освобождаем порт $port..."
        lsof -ti :$port | xargs kill -9
    fi
done

# Установка зависимостей, если они отсутствуют
if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей..."
    npm install
fi

# Запуск сервера
echo "Запуск сервера..."
cd server && npm run dev &
SERVER_PID=$!

# Запуск веб-приложения
echo "Запуск веб-приложения..."
npm start &
WEB_PID=$!

echo "Приложение запущено!"
echo "Сервер: http://localhost:3001"
echo "Веб-приложение: http://localhost:3002"
echo "Нажмите Ctrl+C для остановки..."

# Ожидание Ctrl+C
trap "kill $SERVER_PID $WEB_PID; exit" INT
wait 