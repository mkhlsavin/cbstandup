import React from 'react';
import styled from 'styled-components';
import { useTelegramTheme } from '../context/TelegramThemeContext';

interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

const SafeAreaContainer = styled.div<{
  safeArea: { top: number; right: number; bottom: number; left: number };
}>`
  padding-top: ${props => props.safeArea.top}px;
  padding-right: ${props => props.safeArea.right}px;
  padding-bottom: ${props => props.safeArea.bottom}px;
  padding-left: ${props => props.safeArea.left}px;
  min-height: 100vh;
  box-sizing: border-box;
`;

export const SafeArea: React.FC<SafeAreaProps> = ({ children, className }) => {
  const { safeArea } = useTelegramTheme();

  return (
    <SafeAreaContainer safeArea={safeArea} className={className}>
      {children}
    </SafeAreaContainer>
  );
};
