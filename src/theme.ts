import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
      secondary_bg_color: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
    };
    safeArea: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    isLowPerformance: boolean;
  }
}

export const lightTheme: DefaultTheme = {
  colors: {
    primary: '#2481cc',
    secondary: '#E6B3C3',
    background: '#FFFFFF',
    text: '#000000',
    accent: '#2481cc',
    bg_color: '#FFFFFF',
    text_color: '#000000',
    hint_color: '#707579',
    link_color: '#2481cc',
    button_color: '#2481cc',
    button_text_color: '#FFFFFF',
    secondary_bg_color: '#F5F5F5',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  safeArea: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  isLowPerformance: false,
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#64a8e6',
    secondary: '#2a3441',
    background: '#1f2936',
    text: '#ffffff',
    accent: '#64a8e6',
    bg_color: '#1f2936',
    text_color: '#ffffff',
    hint_color: '#a8a8a8',
    link_color: '#64a8e6',
    button_color: '#64a8e6',
    button_text_color: '#ffffff',
    secondary_bg_color: '#2a3441',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  safeArea: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  isLowPerformance: false,
};

export const theme = lightTheme;
