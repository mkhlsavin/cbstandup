#!/bin/bash

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process using a specific port
kill_port() {
    local port=$1
    if check_port $port; then
        echo "Stopping process using port $port..."
        lsof -ti :$port | xargs kill -9
        sleep 2
    fi
}

# Check and clear ports if needed
WEB_PORT=3000
API_PORT=3001

kill_port $WEB_PORT
kill_port $API_PORT

# Start the server
echo "Starting server..."
cd server && npm start &
SERVER_PID=$!

# Wait a bit to ensure the server has started
sleep 5

# Start the web application
echo "Starting web application..."
npm run start:web &
WEB_PID=$!

# Wait a bit to ensure the web app has started
sleep 5

# Start the bot
echo "Starting bot..."
cd server && npm run start:bot &
BOT_PID=$!

echo "All applications are starting..."
echo "Press Ctrl+C to stop all processes"

# Handle Ctrl+C
trap 'kill $SERVER_PID $WEB_PID $BOT_PID; echo "All processes stopped"; exit' INT

# Keep the script running
while true; do
    sleep 1
done 