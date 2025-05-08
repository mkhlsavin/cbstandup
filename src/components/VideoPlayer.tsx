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
        init: (config: unknown) => unknown;
      };
    };
  }
}

// Global script loading state
let isScriptLoading = false;
let scriptLoadCallbacks: Array<() => void> = [];

const loadScript = (): Promise<void> => {
  return new Promise(resolve => {
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
  const playerRef = useRef<unknown>(null);
  const playerIdRef = useRef<string>(generatePlayerId());
  const fullVideoUrl = `${YANDEX_VIDEO_PLAYER_URL}${videoUrl}`;
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await loadScript();

        if (containerRef.current && !isInitializedRef.current) {
          console.log('Initializing player for URL:', fullVideoUrl);

          // Clean up any existing player
          if (playerRef.current && typeof playerRef.current === 'object') {
            try {
              (playerRef.current as { destroy: () => void }).destroy();
            } catch (error) {
              console.warn('Failed to destroy player on cleanup:', error);
            }
            playerRef.current = null;
          }

          // Create a unique container for this player
          const playerContainer = document.createElement('div');
          playerContainer.id = playerIdRef.current;
          playerContainer.style.width = '100%';
          playerContainer.style.height = '100%';
          containerRef.current.appendChild(playerContainer);

          playerRef.current = window.Ya.playerSdk.init({
            element: playerContainer,
            source: fullVideoUrl,
            autoplay,
            muted: false,
            controls,
            events: {
              onStatusChange: (event: unknown) => {
                const { status, player } = event as { status: PlayerStatus; player: unknown };
                if (player !== playerRef.current) return;
                console.log(`[${playerIdRef.current}] Player status changed:`, status);
                if (onStatusChange) onStatusChange(status);
                if (status === 'play' && onPlay) onPlay();
                if (status === 'pause' && onPause) onPause();
                if ((status === 'end' || status === 'finished') && onEnded) onEnded();
                if (status === 'idle' && onReady) onReady();
              },
              onErrorChange: (event: unknown) => {
                const { error, player } = event as { error: unknown; player: unknown };
                if (player !== playerRef.current) return;
                console.log(`[${playerIdRef.current}] Player error changed:`, error);
                if (onError) onError(error);
              },
              onVolumeChange: (event: unknown) => {
                const { volume, player } = event as PlayerVolumeEvent & { player: unknown };
                if (player !== playerRef.current) return;
                if (volume === 0 && playerRef.current && typeof playerRef.current === 'object') {
                  (playerRef.current as { setVolume: (v: number) => void }).setVolume(1);
                }
              },
            },
          });

          isInitializedRef.current = true;
          console.log(`[${playerIdRef.current}] Player initialized successfully`);
        }
      } catch (error) {
        console.error(`[${playerIdRef.current}] Error initializing player:`, error);
        if (onError) onError(error);
      }
    };

    initializePlayer();

    return () => {
      console.log(`[${playerIdRef.current}] Cleaning up player`);
      if (playerRef.current && typeof playerRef.current === 'object') {
        try {
          (playerRef.current as { destroy: () => void }).destroy();
        } catch (error) {
          console.warn(`[${playerIdRef.current}] Failed to destroy player:`, error);
        }
        playerRef.current = null;
      }
      if (containerRef.current) {
        const playerContainer = containerRef.current.querySelector(`#${playerIdRef.current}`);
        if (playerContainer) {
          playerContainer.remove();
        }
      }
      isInitializedRef.current = false;
    };
  }, [
    fullVideoUrl,
    autoplay,
    controls,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
    onStatusChange,
  ]);

  return <PlayerContainer ref={containerRef} />;
};
