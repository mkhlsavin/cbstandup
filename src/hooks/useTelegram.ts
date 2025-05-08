import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export const useTelegram = () => {
  const user = WebApp.initDataUnsafe?.user as TelegramUser | undefined;

  return {
    user,
    WebApp,
  };
};
