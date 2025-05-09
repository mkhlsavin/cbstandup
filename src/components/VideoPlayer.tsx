import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const YANDEX_VIDEO_PLAYER_URL = 'https://runtime.video.cloud.yandex.net/player/video/';

// Generate unique ID for each player instance
const generatePlayerId = () => `player_${Math.random().toString(36).substr(2, 9)}`;

interface VideoPlayerProps {
  videoUrl: string;
  autoplay?: boolean;
  controls?: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: unknown) => void;
  onStatusChange?: (status: PlayerStatus) => void;
}

interface PlayerVolumeEvent {
  volume: number;
}

type PlayerStatus =
  | 'idle'
  | 'init'
  | 'buffering'
  | 'play'
  | 'pause'
  | 'end'
  | 'fatal'
  | 'broken'
  | 'destroyed'
  | 'cancelled'
  | 'preparing'
  | 'finished';

interface PlayerEvent {
  type: string;
  data?: unknown;
}

declare class Playerjs {
  constructor(config: {
    id: string;
    file: string;
    width: string;
    height: string;
    autostart: boolean;
    controls: boolean;
  });
  on(event: string, callback: (event: PlayerEvent) => void): void;
  api(command: string): void;
}

interface PlayerInstance {
  on(event: string, callback: (event: PlayerEvent) => void): void;
  api(command: string): void;
}

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
`;

declare global {
  interface Window {
    Ya: {
      playerSdk: {
        init: (config: {
          element: HTMLElement | null;
          source: string;
          autoplay: boolean;
          muted: boolean;
          controls: boolean;
        }) => PlayerInstance;
      };
    };
  }
}

// Global script loading state
let isScriptLoading = false;
let scriptLoadCallbacks: Array<() => void> = [];

const loadScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Ya?.playerSdk) {
      resolve();
      return;
    }

    if (isScriptLoading) {
      scriptLoadCallbacks.push(resolve);
      return;
    }

    isScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://runtime.video.cloud.yandex.net/player/js/player-sdk.js';
    script.async = true;
    script.onload = () => {
      isScriptLoading = false;
      resolve();
      scriptLoadCallbacks.forEach(cb => cb());
      scriptLoadCallbacks = [];
    };
    script.onerror = (error) => {
      isScriptLoading = false;
      reject(error);
    };
    document.body.appendChild(script);
  });
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  controls = true,
  autoplay = false,
  onReady,
  onPlay,
  onPause,
  onEnded,
  onError,
  onStatusChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerInstance | null>(null);
  const playerIdRef = useRef<string>(generatePlayerId());
  const fullVideoUrl = `${YANDEX_VIDEO_PLAYER_URL}${videoUrl}`;

  useEffect(() => {
    if (!fullVideoUrl) return;

    const initializePlayer = async () => {
      try {
        await loadScript();

        if (!containerRef.current) {
          throw new Error('Container element not found');
        }

        if (!window.Ya?.playerSdk) {
          throw new Error('Player SDK not loaded');
        }

        const player = window.Ya.playerSdk.init({
          element: containerRef.current,
          source: fullVideoUrl,
          autoplay: false,
          muted: false,
          controls: controls,
        });

        player.on('ready', (event: PlayerEvent) => {
          if (onStatusChange) {
            onStatusChange('init');
          }
        });

        player.on('play', (event: PlayerEvent) => {
          if (onStatusChange) {
            onStatusChange('play');
          }
        });

        player.on('pause', (event: PlayerEvent) => {
          if (onStatusChange) {
            onStatusChange('pause');
          }
        });

        player.on('ended', (event: PlayerEvent) => {
          if (onStatusChange) {
            onStatusChange('end');
          }
        });

        player.on('error', (event: PlayerEvent) => {
          if (onError) {
            onError(event.data);
          }
        });

        playerRef.current = player;
      } catch (error) {
        console.error('Failed to initialize player:', error);
        if (onError) {
          onError(error);
        }
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.api('destroy');
        playerRef.current = null;
      }
    };
  }, [fullVideoUrl, controls, onStatusChange, onError]);

  return <PlayerContainer ref={containerRef} />;
};
