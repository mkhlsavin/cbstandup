import { Bot, Context, session, SessionFlavor } from 'grammy';
import { initializeAssistant } from './openai';

interface SessionData {
  messages: Array<{ role: string; content: string }>;
}

type BotContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<BotContext>(process.env.TELEGRAM_BOT_TOKEN || '');

// Middleware для сессий
bot.use(session({
  initial: (): SessionData => ({
    messages: [],
  }),
}));

// Обработка команды /start
bot.command('start', async (ctx) => {
  await ctx.reply('Привет! Я бот для подготовки к ДВИ по химии и биологии. Используйте команду /ask для начала обучения.');
});

// Обработка команды /ask
bot.command('ask', async (ctx) => {
  const question = ctx.message?.text.replace('/ask', '').trim();
  if (!question) {
    await ctx.reply('Пожалуйста, задайте вопрос после команды /ask');
    return;
  }

  try {
    // Добавляем сообщение в историю
    ctx.session.messages.push({ role: 'user', content: question });

    // Получаем ответ от ассистента
    const response = await initializeAssistant();
    const completion = await response.chat.completions.create({
      messages: ctx.session.messages,
      model: 'gpt-4-turbo-preview',
    });

    const answer = completion.choices[0]?.message?.content || 'Извините, не удалось получить ответ';
    await ctx.reply(answer);

    // Добавляем ответ ассистента в историю
    ctx.session.messages.push({ role: 'assistant', content: answer });
  } catch (error) {
    console.error('Error in /ask command:', error);
    await ctx.reply('Произошла ошибка при обработке вашего запроса');
  }
});

export const startBot = async () => {
  try {
    await bot.start();
    console.log('Bot started successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    throw error;
  }
}; 