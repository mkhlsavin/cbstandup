import { DataSource } from 'typeorm';
import { Video } from '../entities/Video';
import { UserFavorite } from '../entities/UserFavorite';
import { config } from './index';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Video, UserFavorite],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
