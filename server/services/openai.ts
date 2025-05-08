import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let assistant: any = null;

export async function initializeAssistant() {
  try {
    // Create or get existing assistant
    const assistants = await openai.beta.assistants.list();
    assistant = assistants.data.find(a => a.name === 'BiologyChemistryTutor');

    if (!assistant) {
      assistant = await openai.beta.assistants.create({
        name: 'BiologyChemistryTutor',
        instructions: `You are a biology and chemistry tutor. Your role is to:
1. Help students understand complex biological and chemical concepts
2. Provide clear explanations and examples
3. Answer questions about biology and chemistry topics
4. Guide students through problem-solving
5. Recommend relevant educational resources

You should:
- Use simple language to explain complex concepts
- Provide real-world examples when possible
- Break down complex problems into manageable steps
- Encourage critical thinking
- Be patient and supportive

You should NOT:
- Provide direct answers to homework or test questions
- Make definitive medical diagnoses
- Give advice about dangerous experiments
- Share personal opinions about controversial topics`,
        model: 'gpt-4-turbo-preview',
        tools: [{ type: 'code_interpreter' }],
      });
    }

    return assistant;
  } catch (error) {
    console.error('Error initializing OpenAI assistant:', error);
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