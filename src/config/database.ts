import { DataSource } from 'typeorm';
import { Video } from '../entities/Video';
import { UserFavorite } from '../entities/UserFavorite';
import logger from '../logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'cbstandup',
  synchronize: true,
  logging: true,
  entities: ['src/entities/*.ts'],
  subscribers: [],
  migrations: [],
});

// Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    logger.info('Data Source has been initialized!');
  })
  .catch(error => {
    logger.error('Error during Data Source initialization:', error);
  });
