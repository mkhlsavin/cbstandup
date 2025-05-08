import { Injectable, Logger } from '@nestjs/common';
import { Bot, Context, session, SessionFlavor } from 'grammy';
import { VideoService } from './video.service';
import { OpenAIService } from './openai';
import { Video } from '../entities/Video';
import { VideoTag } from '../types';

interface SessionData {
  // Здесь можно добавить данные сессии, если они понадобятся
}

type BotContext = Context & SessionFlavor<SessionData>;

@Injectable()
export class TelegramService {
  private bot: Bot<BotContext> | null = null;
  private readonly logger = new Logger(TelegramService.name);
  private isStarting = false;

  constructor(
    private readonly videoService: VideoService,
    private readonly openaiService: OpenAIService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not set. Telegram bot will be disabled.');
      return;
    }

    try {
      this.bot = new Bot<BotContext>(token);
      this.bot.use(session({ initial: () => ({}) }));
      this.setupCommands();
      this.logger.log('Telegram bot instance created successfully');
    } catch (error) {
      this.logger.error('Failed to create Telegram bot instance:', error);
    }
  }

  private setupCommands() {
    if (!this.bot) return;

    // Обработка обычных сообщений
    this.bot.on('message', async (ctx) => {
      // Пропускаем команды
      if (ctx.message.text?.startsWith('/')) return;

      if (!ctx.from) {
        await ctx.reply('Не удалось определить пользователя');
        return;
      }

      try {
        const response = await this.openaiService.getAssistantResponse(
          ctx.message.text || '',
          ctx.from.id.toString()
        );
        await ctx.reply(response);
      } catch (error) {
        this.logger.error('Error processing message:', error);
        await ctx.reply('Произошла ошибка при обработке вашего сообщения');
      }
    });

    // Обработка лайков
    this.bot.on('callback_query', async (ctx) => {
      if (!ctx.callbackQuery.data?.startsWith('like_')) return;
      if (!ctx.from) {
        this.logger.error('User context is missing in callback query');
        await ctx.answerCallbackQuery('Не удалось определить пользователя');
        return;
      }

      try {
        const videoId = parseInt(ctx.callbackQuery.data.replace('like_', ''), 10);
        const telegramUserId = ctx.from.id.toString();
        this.logger.log(`Processing like for video ID: ${videoId} from user ${telegramUserId}`);
        
        if (isNaN(videoId)) {
          this.logger.error(`Invalid video ID: ${ctx.callbackQuery.data}`);
          await ctx.answerCallbackQuery('Неверный ID видео');
          return;
        }

        // Сначала добавляем видео в избранное
        await this.videoService.toggleFavorite(telegramUserId, videoId);
        this.logger.log(`Video ${videoId} added to favorites for user ${telegramUserId}`);

        const video = await this.videoService.getVideoById(videoId);
        this.logger.log(`Retrieved video: ${JSON.stringify(video)}`);
        
        if (!video) {
          this.logger.error(`Video not found: ${videoId}`);
          await ctx.answerCallbackQuery('Видео не найдено');
          return;
        }

        // Отправляем сообщение о начале обработки
        await ctx.answerCallbackQuery('Обрабатываю ваш запрос...');
        this.logger.log(`Sending video like request to OpenAI for video ${videoId}`);
        
        // Получаем ответ от ассистента
        const response = await this.openaiService.handleVideoLike(
          video,
          telegramUserId
        );
        
        this.logger.log(`Received response from OpenAI for video ${videoId}`);
        // Отправляем ответ пользователю
        await ctx.reply(response);
        this.logger.log(`Response sent to user ${telegramUserId}`);
      } catch (error) {
        this.logger.error('Error processing video like:', error);
        await ctx.answerCallbackQuery('Произошла ошибка при обработке запроса');
      }
    });

    this.bot.command('start', async (ctx) => {
      if (!ctx.from) {
        await ctx.reply('Не удалось определить пользователя');
        return;
      }

      await ctx.reply('Привет! Я ИИ-бот котрорый будет помогать тебе в изучении химии и биологии. Как только ты лайкнешь видео, я пойму что ты хочешь изучить эту тему поглубже и смогу объяснить ее тебе понятным языком и помочь с решением задач. Нажми на кнопку "Видео" или используй /help для списка команд.');

      try {
        // Запускаем беседу с ассистентом
        const response = await this.openaiService.startConversation(ctx.from.id.toString());
        await ctx.reply(response);
      } catch (error) {
        this.logger.error('Error starting conversation:', error);
      }
    });

    this.bot.command('help', async (ctx) => {
      await ctx.reply(
        'Доступные команды:\n' +
          '/list - показать все видео\n' +
          '/tag <тег> - найти видео по тегу\n' +
          '/favorites - показать избранные видео\n' +
          '/ask <вопрос> - задать вопрос ассистенту',
      );
    });

    this.bot.command('list', async (ctx) => {
      try {
        const videos = await this.videoService.getVideos();
        const message = videos.map((v: Video) => `${v.title} - ${v.tag}`).join('\n');
        await ctx.reply(message || 'Видео не найдены');
      } catch (error) {
        this.logger.error('Error in /list command:', error);
        await ctx.reply('Произошла ошибка при получении списка видео');
      }
    });

    this.bot.command('tag', async (ctx) => {
      if (!ctx.message?.text) {
        await ctx.reply('Пожалуйста, укажите тег. Например: /tag химия');
        return;
      }
      const tag = ctx.message.text.split(' ').slice(1).join(' ');
      if (!tag) {
        await ctx.reply('Пожалуйста, укажите тег. Например: /tag химия');
        return;
      }

      try {
        const videos = await this.videoService.getVideosByTag(tag as VideoTag);
        const message = videos.map((v: Video) => v.title).join('\n');
        await ctx.reply(message || `Видео с тегом "${tag}" не найдены`);
      } catch (error) {
        this.logger.error('Error in /tag command:', error);
        await ctx.reply('Произошла ошибка при поиске видео по тегу');
      }
    });

    this.bot.command('favorites', async (ctx) => {
      if (!ctx.from) {
        await ctx.reply('Не удалось определить пользователя');
        return;
      }
      const userId = ctx.from.id.toString();
      try {
        const favorites = await this.videoService.getFavorites(userId);
        const message = favorites.map((v: Video) => v.title).join('\n');
        await ctx.reply(message || 'У вас нет избранных видео');
      } catch (error) {
        this.logger.error('Error in /favorites command:', error);
        await ctx.reply('Произошла ошибка при получении избранных видео');
      }
    });

    this.bot.command('ask', async (ctx) => {
      if (!ctx.message?.text) {
        await ctx.reply(
          'Пожалуйста, задайте вопрос. Например: /ask Какие продукты образуются при гидролизе этилацетата в кислой среде?',
        );
        return;
      }
      if (!ctx.from) {
        await ctx.reply('Не удалось определить пользователя');
        return;
      }

      const question = ctx.message.text.split(' ').slice(1).join(' ');
      if (!question) {
        await ctx.reply(
          'Пожалуйста, задайте вопрос. Например: /ask Какие продукты образуются при гидролизе этилацетата в кислой среде?',
        );
        return;
      }

      try {
        const response = await this.openaiService.getAssistantResponse(question, ctx.from.id.toString());
        await ctx.reply(response);
      } catch (error) {
        this.logger.error('Error in /ask command:', error);
        await ctx.reply('Произошла ошибка при обработке вашего вопроса');
      }
    });
  }

  async start() {
    if (!this.bot) {
      this.logger.warn('Telegram bot is disabled due to missing token');
      return;
    }

    if (this.isStarting) {
      this.logger.warn('Telegram bot is already starting');
      return;
    }

    this.isStarting = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds

    while (retryCount < maxRetries) {
      try {
        this.logger.log(`Attempt ${retryCount + 1} to start Telegram bot...`);
        
        // Check network connectivity first
        try {
          await this.bot.api.getMe();
          this.logger.log('Successfully connected to Telegram API');
        } catch (error: any) {
          if (error.message?.includes('ENOTFOUND')) {
            this.logger.error('Network error: Cannot connect to Telegram API. Please check your internet connection.');
            throw new Error('Network connectivity issue');
          }
          throw error;
        }

        this.logger.log('Checking webhook status...');
        const webhookInfo = await this.bot.api.getWebhookInfo();

        if (webhookInfo.url) {
          this.logger.log(`Removing existing webhook at ${webhookInfo.url}...`);
          await this.bot.api.deleteWebhook({ drop_pending_updates: true });
          this.logger.log('Webhook removed successfully');
        }

        this.logger.log('Starting bot...');
        await this.bot.start();
        this.logger.log('Bot started successfully');
        
        // Verify bot is running
        const botInfo = await this.bot.api.getMe();
        this.logger.log(`Bot @${botInfo.username} is now running`);
        
        return;
      } catch (error: any) {
        retryCount++;
        
        if (error.message === 'Network connectivity issue') {
          if (retryCount < maxRetries) {
            this.logger.warn(`Network error. Retrying in ${retryDelay/1000} seconds... (Attempt ${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
        }

        this.logger.error('Error starting Telegram bot:', error);
        if (retryCount === maxRetries) {
          throw new Error(`Failed to start Telegram bot after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
  }

  async stop() {
    if (this.bot) {
      try {
        await this.bot.stop();
        this.logger.log('Telegram bot stopped');
      } catch (error) {
        this.logger.error('Error stopping Telegram bot:', error);
      }
    }
  }
}

export function startBot(): void {
  const logger = new Logger('Telegram');
  logger.log('Starting Telegram bot...');
}
