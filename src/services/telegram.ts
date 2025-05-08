import { Telegraf, Context } from 'telegraf';
import { config } from '../config';
import { createThread, getAssistantResponse } from './openai';
import logger from '../logger';

// Store user threads and learning states
interface UserState {
  threadId: string;
  isLearningMode: boolean;
  currentVideoTitle?: string;
}

const userStates = new Map<number, UserState>();

if (!config.telegram.token) {
  throw new Error(
    'Telegram bot token is not configured. Please set REACT_APP_TELEGRAM_BOT_TOKEN environment variable.'
  );
}

const bot = new Telegraf(config.telegram.token);

// Initialize bot commands
bot.command('start', async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    // Create new thread for user
    const threadId = await createThread();
    userStates.set(userId, {
      threadId,
      isLearningMode: false,
    });

    await ctx.reply(
      '👋 Привет! Я ваш AI-репетитор по биологии и химии.\n\n' +
        'Я могу помочь вам:\n' +
        '• Объяснить сложные концепции\n' +
        '• Решить задачи\n' +
        '• Ответить на вопросы\n' +
        '• Подготовиться к экзаменам\n\n' +
        'Просто напишите ваш вопрос, и я постараюсь помочь!'
    );
  } catch (error) {
    logger.error('Error in start command:', error);
    await ctx.reply('Извините, произошла ошибка. Пожалуйста, попробуйте позже.');
  }
});

// Handle text messages
bot.on('text', async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    // Get or create user state
    let userState = userStates.get(userId);
    if (!userState) {
      const threadId = await createThread();
      userState = {
        threadId,
        isLearningMode: false,
      };
      userStates.set(userId, userState);
    }

    // Send "typing" action
    await ctx.replyWithChatAction('typing');

    // Get response from OpenAI
    if (ctx.message && 'text' in ctx.message) {
      const response = await getAssistantResponse(ctx.message.text);
      await ctx.reply(response);
    } else {
      await ctx.reply('Пожалуйста, отправьте текстовое сообщение.');
    }
  } catch (error) {
    logger.error('Error handling message:', error);
    await ctx.reply('Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.');
  }
});

// Handle learning mode start
export function startLearningMode(userId: number, videoTitle: string) {
  const userState = userStates.get(userId);
  if (userState) {
    userState.isLearningMode = true;
    userState.currentVideoTitle = videoTitle;
    userStates.set(userId, userState);
  }
}

// Handle learning mode end
export function endLearningMode(userId: number) {
  const userState = userStates.get(userId);
  if (userState) {
    userState.isLearningMode = false;
    userState.currentVideoTitle = undefined;
    userStates.set(userId, userState);
  }
}

// Handle errors
bot.catch((err, ctx) => {
  logger.error('Bot error:', err);
  ctx.reply('Извините, произошла ошибка. Пожалуйста, попробуйте позже.');
});

export async function startBot() {
  try {
    await bot.launch();
    logger.info('Bot started successfully');
  } catch (error) {
    logger.error('Error starting bot:', error);
    throw error;
  }

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
