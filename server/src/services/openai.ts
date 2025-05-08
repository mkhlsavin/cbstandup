import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { Video } from '../entities/Video';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;
  private readonly assistantId: string;
  private userThreads: Map<string, string> = new Map(); // userId -> threadId

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    const assistantId = process.env.OPENAI_ASSISTANT_ID;
    if (!assistantId) {
      this.logger.error('OPENAI_ASSISTANT_ID is not set');
      throw new Error('OPENAI_ASSISTANT_ID is not set');
    }

    this.openai = new OpenAI({ apiKey });
    this.assistantId = assistantId;
  }

  private async getOrCreateThread(userId: string): Promise<string> {
    let threadId = this.userThreads.get(userId);
    if (!threadId) {
      const thread = await this.openai.beta.threads.create();
      threadId = thread.id;
      this.userThreads.set(userId, threadId);
    }
    return threadId;
  }

  async getAssistantResponse(message: string, userId: string): Promise<string> {
    try {
      const threadId = await this.getOrCreateThread(userId);

      // Добавляем сообщение в тред
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      // Запускаем ассистента
      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
      });

      // Ждем завершения выполнения
      let runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      if (runStatus.status === 'completed') {
        // Получаем сообщения из треда
        const messages = await this.openai.beta.threads.messages.list(threadId);
        const assistantMessage = messages.data.find(m => m.role === 'assistant');

        if (assistantMessage && assistantMessage.content[0].type === 'text') {
          return assistantMessage.content[0].text.value;
        }
      }

      throw new Error(`Run ended with status: ${runStatus.status}`);
    } catch (error) {
      this.logger.error('Error getting assistant response:', error);
      throw error;
    }
  }

  async handleVideoLike(video: Video, userId: string): Promise<string> {
    try {
      this.logger.log(`Processing video like for user ${userId}, video ID: ${video.id}`);
      this.logger.log(`Video description: ${video.description}`);

      if (!video.description) {
        this.logger.error('Video description is missing');
        throw new Error('Video description is required');
      }

      const prompt = `Пожалуйста, объясни подробнее тему из этого видео: ${video.description}`;
      this.logger.log(`Sending prompt to assistant: ${prompt}`);

      const response = await this.getAssistantResponse(prompt, userId);
      this.logger.log(`Received response from assistant for video ${video.id}`);

      return response;
    } catch (error) {
      this.logger.error('Error handling video like:', error);
      throw error;
    }
  }

  async startConversation(userId: string): Promise<string> {
    try {
      const prompt =
        'Привет! Я твой ИИ-ассистент по химии и биологии. Я готов помочь тебе с изучением этих предметов. Расскажи, что именно тебя интересует?';
      return await this.getAssistantResponse(prompt, userId);
    } catch (error) {
      this.logger.error('Error starting conversation:', error);
      throw error;
    }
  }
}

export async function initializeAssistant(): Promise<void> {
  const logger = new Logger('OpenAI');
  logger.log('Initializing OpenAI assistant...');
}
