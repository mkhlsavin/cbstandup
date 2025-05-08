import { DataSource, DataSourceOptions } from 'typeorm';
import { Video } from '../entities/Video';
import { UserFavorite } from '../entities/UserFavorite';
import { config } from './index';

const databaseConfig: DataSourceOptions = config.database.url
  ? {
      type: 'postgres',
      url: config.database.url,
    }
  : {
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
    };

export const AppDataSource = new DataSource({
  ...databaseConfig,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Video, UserFavorite],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
