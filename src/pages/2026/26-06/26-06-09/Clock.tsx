import vegasFont from '@/assets/fonts/25fonts/25-07-05-vegas.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useRef } from 'react';

// Declare global types for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

const GARISH_COLORS = [
  '#FF00FF', // Neon Magenta
  '#39FF14', // Neon Green
  '#FFFB00', // Neon Yellow
  '#00FFFF', // Cyan
  '#FF3131', // Neon Red
  '#FF5E00', // Neon Orange
];

const Clock: React.FC = () => {
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'VegasFont',
        fontUrl: vegasFont,
        options: { weight: 'normal', style: 'normal' },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    let isMounted = true;
    const scriptId = 'youtube-iframe-api-script';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initPlayer = () => {
      if (!isMounted) return;
      if (playerRef.current) return;
      if (!playerContainerRef.current) return;
      if (!window.YT?.Player) return;

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId: 'ZvYvZLfPatQ',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          loop: 1,
          playlist: 'ZvYvZLfPatQ',
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            if (isMounted) event.target.playVideo();
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(scriptTag);
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    return () => {
      isMounted = false;
      playerRef.current = null;
    };
  }, []);

  // Full-screen, non-interactive background embed
  const iframeStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    pointerEvents: 'none',
    background: '#000',
  };

  const clockContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    display: 'flex',
    gap: '0.4rem',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  const digitBoxStyle = (color: string): React.CSSProperties => ({
    width: '0.9em',
    height: '1.4em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    fontFamily: 'VegasFont, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 'clamp(2rem, 19vw, 4rem)',
  });

  const getTwo = (n: number) => String(n).padStart(2, '0');

  const time = useSecondClock();
  const timeStr = `${getTwo(time.getHours())}:${getTwo(time.getMinutes())}:${getTwo(time.getSeconds())}`;

  return (
    <>
      <div style={iframeStyle}>
        <div ref={playerContainerRef} />
      </div>

      <div style={clockContainerStyle} aria-label={timeStr}>
        {timeStr.split('').map((char, i) => (
          <div
            key={i}
            style={digitBoxStyle(GARISH_COLORS[i % GARISH_COLORS.length])}
          >
            {char}
          </div>
        ))}
      </div>
    </>
  );
};

export default Clock;
