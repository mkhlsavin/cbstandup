# Build stage for the client
FROM node:18-alpine as client-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
# Устанавливаем переменные окружения для сборки
ENV NODE_ENV=production
ENV REACT_APP_API_URL=https://cbstandup.ru/api
RUN npm run build

# Build stage for the server
FROM node:18-alpine as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy server files
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Copy client files
COPY --from=client-builder /app/build ./client/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the server
WORKDIR /app/server
CMD ["node", "dist/main.js"] 