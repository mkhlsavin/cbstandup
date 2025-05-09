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

# Stop all Node.js processes
echo "Stopping all Node.js processes..."
pkill -f node
sleep 2

# Check and clear ports if needed
WEB_PORT=3002
API_PORT=3001

kill_port $WEB_PORT
kill_port $API_PORT

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install server dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

# Start the server
echo "Starting server..."
cd server
export NODE_ENV=development
export PORT=3001
npm run dev &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Start the web application
echo "Starting web application..."
export PORT=3002
npm run start:web &
WEB_PID=$!

echo "Applications are starting..."
echo "Server will be available at: http://localhost:3001"
echo "Web application will be available at: http://localhost:3002"
echo "Press Ctrl+C to stop all processes"

# Handle Ctrl+C
trap 'echo "Stopping all processes..."; kill $SERVER_PID $WEB_PID; pkill -f node; echo "All processes stopped"; exit' INT

# Keep the script running
while true; do
    sleep 1
done 