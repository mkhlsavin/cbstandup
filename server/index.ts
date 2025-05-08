import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AppDataSource, initializeDatabase } from './src/database';
import { Video } from './src/entities/Video';
import { UserFavorite } from './src/entities/UserFavorite';
import logger from './src/logger';
import { initializeAssistant } from './services/openai';
import { startBot } from './services/telegram';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Инициализация базы данных и сервисов
async function initialize() {
  try {
    // Инициализация базы данных
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Инициализация OpenAI ассистента
    await initializeAssistant();
    logger.info('OpenAI assistant initialized');

    // Запуск Telegram бота
    await startBot();
    logger.info('Telegram bot started');

    // Запуск сервера
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Error during initialization:', error);
    process.exit(1);
  }
}

// Video routes
app.get('/videos', async (_req, res) => {
  try {
    logger.info('Fetching all videos');
    const videos = await AppDataSource.getRepository(Video).find();
    logger.info(`Found ${videos.length} videos`);
    res.json(videos);
  } catch (error) {
    logger.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/videos/tag/:tag', async (req, res) => {
  try {
    const videos = await AppDataSource.getRepository(Video).find({
      where: { tag: req.params.tag }
    });
    res.json(videos);
  } catch (error) {
    logger.error('Error fetching videos by tag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Favorites routes
app.get('/favorites/:userId', async (req, res) => {
  try {
    const favorites = await AppDataSource.getRepository(UserFavorite)
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.video', 'video')
      .where('favorite.user_id = :userId', { userId: req.params.userId })
      .getMany();
    res.json(favorites.map(f => f.video));
  } catch (error) {
    logger.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const favorite = await AppDataSource.getRepository(UserFavorite).save({
      user_id: userId,
      video_id: parseInt(videoId)
    });
    res.json(favorite);
  } catch (error) {
    logger.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/favorites/:userId/:videoId', async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    await AppDataSource.getRepository(UserFavorite).delete({
      user_id: parseInt(userId),
      video_id: parseInt(videoId)
    });
    res.status(204).send();
  } catch (error) {
    logger.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Запуск приложения
initialize(); 