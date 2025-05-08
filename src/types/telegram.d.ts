declare namespace Telegram {
  interface PopupButton {
    type: 'ok' | 'close' | 'cancel';
    id?: string;
  }

  interface PopupParams {
    title: string;
    message: string;
    buttons?: PopupButton[];
  }

  interface WebAppUser {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  }

  interface WebAppInitData {
    user?: WebAppUser;
  }

  interface WebApp {
    ready(): void;
    expand(): void;
    showPopup(params: PopupParams): void;
    isVersionAtLeast(version: string): boolean;
    initDataUnsafe: WebAppInitData;
    openTelegramLink(url: string): void;
  }
}

interface Telegram {
  WebApp: Telegram.WebApp;
}

declare global {
  interface Window {
    Telegram?: Telegram;
  }
}

export {};
