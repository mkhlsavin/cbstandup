import { Telegraf } from 'telegraf';
import { getAssistantResponse } from './openai';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command('start', async (ctx) => {
  await ctx.reply(
    'Привет! Я бот-помощник по биологии и химии. Задавайте мне вопросы, и я постараюсь помочь вам разобраться в этих предметах.'
  );
});

bot.on('text', async (ctx) => {
  try {
    const message = ctx.message.text;
    const response = await getAssistantResponse(message);
    await ctx.reply(response);
  } catch (error) {
    console.error('Error handling message:', error);
    await ctx.reply('Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.');
  }
});

export async function startBot() {
  try {
    await bot.launch();
    console.log('Bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    throw error;
  }
} 