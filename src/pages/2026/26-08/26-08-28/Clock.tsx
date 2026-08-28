import React, { useRef } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import mazeImage from '@/assets/images/26_images/26-08/26-08-28/maze.webp';
import mazeFontUrl from '@/assets/fonts/26fonts/26-08-28.woff2?url';
import { useMazeRenderer } from './useMazeRenderer';
import styles from './Clock.module.css';

export const assets = [mazeImage, mazeFontUrl];

const InfiniteMaze = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tileRef = useRef<HTMLDivElement | null>(null);
  const time = useMillisecondClock();

  const fontConfigs: FontConfig[] = [{ fontFamily: 'MazeFont', fontUrl: mazeFontUrl }];
  useSuspenseFontLoader(fontConfigs);
  useMazeRenderer(mountRef);

  const dateTime = time.toISOString();
  const timeString = time.toLocaleTimeString();
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const clockText = `${hours}${minutes}${seconds}`;

  useEffect(() => {
    if (!tileRef.current) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80">
      <text x="0" y="55" font-family="'MazeFont', 'Courier New', Courier, monospace" font-size="40" font-weight="bold" fill="white" letter-spacing="6">${clockText}</text>
    </svg>`;
    tileRef.current.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
  }, [clockText]);

  return (
    <main ref={mountRef} className={styles.container}>
      <img src={mazeImage} alt="" className={styles.bgImage} aria-hidden="true" />
      <div ref={tileRef} className={styles.clockTiled} aria-hidden="true" />
      <div className={styles.clockDisplay} aria-label="Current time" role="timer">
        {clockText}
      </div>
      <time dateTime={dateTime} className={styles.srOnly}>
        {timeString}
      </time>
    </main>
  );
};

const MemoizedInfiniteMaze = React.memo(InfiniteMaze);
MemoizedInfiniteMaze.displayName = 'Clock_26_08_28';
export default MemoizedInfiniteMaze;
