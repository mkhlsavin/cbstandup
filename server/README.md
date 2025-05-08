# Backend Server Structure

This directory contains the backend server code of the application. Below is a detailed description of each subdirectory and its purpose.

## Directory Structure

### `/src`
Main source code directory containing the server implementation.

### `/config`
Server configuration files, environment variables, and settings.

### `/logs`
Application log files and logging configuration.

### `/services`
Backend service implementations, including business logic and external service integrations.

### `/entities`
Data models, database schemas, and entity definitions.

## Key Files

- `index.ts` - Main server entry point
- `bot.ts` - Bot implementation and configuration
- `Dockerfile` - Docker configuration for containerization
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing configuration
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier code formatting configuration

## Development Guidelines

1. Follow TypeScript best practices and maintain type safety
2. Write unit tests for new features and services
3. Keep services modular and focused on specific responsibilities
4. Use proper error handling and logging
5. Follow the established folder structure for new features
6. Document API endpoints and service interfaces

## Setup and Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in the config directory

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Docker Support

The server can be containerized using the provided Dockerfile. Build and run the container using:

```bash
docker build -t server .
docker run -p 3000:3000 server
``` 