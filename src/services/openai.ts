import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

const assistant: OpenAI.Beta.Assistants.Assistant | null = null;

export async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    return thread.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
}

export async function getAssistantResponse(message: string) {
  try {
    if (!assistant) {
      throw new Error('Assistant not initialized');
    }

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    const content = lastMessage.content[0];

    if ('text' in content) {
      return content.text.value;
    } else {
      throw new Error('Unexpected message content type');
    }
  } catch (error) {
    console.error('Error getting assistant response:', error);
    throw error;
  }
}
