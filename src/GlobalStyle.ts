import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.colors.bg_color};
    color: ${props => props.theme.colors.text_color};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: ${props => props.theme.safeArea.top}px ${props =>
  props.theme.safeArea.right}px ${props => props.theme.safeArea.bottom}px ${props =>
  props.theme.safeArea.left}px;
    min-height: 100%;
    width: 100%;
    position: relative;
    overflow-x: hidden;
  }

  a {
    color: ${props => props.theme.colors.link_color};
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    
    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.accent};
      outline-offset: 2px;
    }
  }

  button {
    background: ${props => props.theme.colors.button_color};
    color: ${props => props.theme.colors.button_text_color};
    border: none;
    border-radius: ${props => props.theme.borderRadius.medium};
    padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.accent};
      outline-offset: 2px;
    }
  }

  input, textarea {
    background: ${props => props.theme.colors.secondary_bg_color};
    color: ${props => props.theme.colors.text_color};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: ${props => props.theme.borderRadius.medium};
    padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
    font-size: 14px;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;

    &::placeholder {
      color: ${props => props.theme.colors.hint_color};
    }

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent};
    }

    &:focus-visible {
      outline: 2px solid ${props => props.theme.colors.accent};
      outline-offset: 2px;
    }
  }

  /* Стили для скринридеров */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  /* Адаптивные стили */
  @media (max-width: 768px) {
    body {
      font-size: 16px;
    }
    
    button, input, textarea {
      font-size: 16px; // Предотвращает зум на iOS
    }
  }

  @media (orientation: landscape) {
    body {
      padding: ${props => Math.max(props.theme.safeArea.top, 20)}px ${props =>
  props.theme.safeArea.right}px ${props => props.theme.safeArea.bottom}px ${props =>
  props.theme.safeArea.left}px;
    }
  }

  /* Анимации */
  @media (prefers-reduced-motion: no-preference) {
    button {
      transition: transform 0.2s ease, opacity 0.2s ease;
      
      &:active {
        transform: scale(0.98);
      }
    }
  }

  /* Отключение анимаций для низкопроизводительных устройств */
  ${props =>
    props.theme.isLowPerformance &&
    `
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  `}

  /* Улучшения для мобильных устройств */
  @media (hover: none) and (pointer: coarse) {
    button, a {
      cursor: default;
    }
  }

  /* Улучшения для темной темы */
  @media (prefers-color-scheme: dark) {
    img {
      filter: brightness(0.8) contrast(1.2);
    }
  }

  /* Улучшения для печати */
  @media print {
    body {
      background: white;
      color: black;
      padding: 0;
    }

    button, input, textarea {
      border: 1px solid #000;
    }
  }
`;
