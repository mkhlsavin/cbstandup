# Frontend Source Code Structure

This directory contains the frontend source code of the application. Below is a detailed description of each subdirectory and its purpose.

## Directory Structure

### `/api`

Contains API-related code, including API client configuration, endpoints, and request/response types.

### `/components`

Reusable React components used throughout the application. Components are organized by feature or functionality.

### `/config`

Application configuration files and environment-specific settings.

### `/context`

React Context providers and related hooks for state management across the application.

### `/data`

Static data, constants, and mock data used in the application.

### `/entities`

TypeScript interfaces and types representing core business entities.

### `/hooks`

Custom React hooks that encapsulate reusable logic and state management.

### `/logger`

Logging utilities and configuration for frontend logging.

### `/scripts`

Utility scripts and build tools specific to the frontend.

### `/services`

Service layer implementations for business logic and external service integrations.

### `/types`

TypeScript type definitions and declarations used throughout the application.

## Key Files

- `App.tsx` - Main application component
- `index.tsx` - Application entry point
- `theme.ts` - Global theme configuration
- `GlobalStyle.ts` - Global styles configuration
- `styled.d.ts` - TypeScript declarations for styled-components
- `config.ts` - Application configuration

## Development Guidelines

1. Keep components small and focused on a single responsibility
2. Use TypeScript for all new code
3. Follow the established folder structure for new features
4. Maintain consistent naming conventions
5. Write unit tests for new components and utilities
