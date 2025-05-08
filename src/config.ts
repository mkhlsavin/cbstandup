interface Config {
  api: {
    baseUrl: string;
  };
  telegram: {
    token: string | undefined;
    botUsername: string;
  };
  openai: {
    apiKey: string | undefined;
    assistantName: string;
  };
}

export const config: Config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  },
  telegram: {
    token: process.env.REACT_APP_TELEGRAM_BOT_TOKEN,
    botUsername: process.env.REACT_APP_BOT_USERNAME || '@cbstandup_bot',
  },
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    assistantName: 'AI-tutor',
  },
};
