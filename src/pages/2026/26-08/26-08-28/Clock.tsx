import mazeFontUrl from '@/assets/fonts/26fonts/26-08-28.woff2?url';
import mazeImage from '@/assets/images/26_images/26-08/26-08-28/maze.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import React, { useRef } from 'react';
import styles from './Clock.module.css';
import { useMazeRenderer } from './useMazeRenderer';

export const assets = [mazeImage, mazeFontUrl];

const InfiniteMaze = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tileRef = useRef<HTMLDivElement | null>(null);
  const time = useSmoothClock();

  const fontConfigs: FontConfig[] = [{ fontFamily: 'MazeFont', fontUrl: mazeFontUrl }];
  useSuspenseFontLoader(fontConfigs);
  useMazeRenderer(mountRef);

  const dateTime = time.toISOString();
  const timeString = time.toLocaleTimeString();
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const clockText = `${hours}${minutes}${seconds}`;

  return (
    <main ref={mountRef} className={styles.container}>
      <img src={mazeImage} alt="" className={styles.bgImage} aria-hidden="true" />
      <div ref={tileRef} className={styles.clockTiled} aria-hidden="true">
        <svg className={styles.tiledSvg} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="textPattern" x="-90" y="-35" width="180" height="70" patternUnits="userSpaceOnUse">
               <text x="0" y="50" font-family="'MazeFont', monospace" font-size="48" font-weight="bold" fill="white" letter-spacing="2">
                {clockText}
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#textPattern)" />
        </svg>
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