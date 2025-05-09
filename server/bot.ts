import 'dotenv/config';
import { initializeAssistant } from './services/openai';
import { startBot } from './services/telegram';
import { OpenAI } from 'openai';
import TelegramBot from 'node-telegram-bot-api';

const assistant = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: true });

async function main() {
  try {
    // Initialize OpenAI assistant
    await initializeAssistant();
    console.log('OpenAI assistant initialized');

    // Start Telegram bot
    await startBot();
    console.log('Telegram bot started');
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

main(); 