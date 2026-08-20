import React, { useEffect, useMemo, memo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import f251023 from '@/assets/fonts/25fonts/25-10-23-gr.ttf?url';
import bgImage from '@/assets/images/25_images/25-10/25-10-23/bg.gif';
import styles from './Clock.module.css';

export const assets = [f251023, bgImage];

const fontConfigs = [
  {
    fontFamily: 'mult',
    fontUrl: f251023,
    options: { weight: 'normal', style: 'normal' },
  },
];

const Clockgrid =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const [viewport, setViewport] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize =  () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { hours, minutes, seconds, millis, ampm } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(time.getMilliseconds() / 10).toString().padStart(2, '0');
    const ap = time.getHours() >= 12 ? 'PM' : 'AM';
    return { hours: h, minutes: m, seconds: s, millis: ms, ampm: ap };
  }, [time]);

  const timeCharacters = useMemo(() => {
    const timeString = hours + minutes + seconds + millis + ampm;
    return timeString.toUpperCase().split('');
  }, [hours, minutes, seconds, millis, ampm]);

  const patternLength = timeCharacters.length;

  const CELL_VH = 10;
  const ROWS =
    Math.ceil(viewport.height / ((CELL_VH / 100) * viewport.height)) + 2;
  const COLUMNS =
    Math.ceil(viewport.width / ((CELL_VH / 100) * viewport.height)) + 2;
  const totalCells = ROWS * COLUMNS;
  const repeatCount = Math.ceil(totalCells / patternLength);
  const totalCharactersToRender = repeatCount * patternLength;

  const allCharacters = Array.from(
    { length: totalCharactersToRender },
    (_, i) => {
      const char = timeCharacters[i % patternLength];
      return (
        <div key={i} className={styles.characterCell}>
          <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>
          {char}
        </div>
      );
    },
  );

  return (
    <main className={styles.container}>
      <div
        className={styles.clockGrid}
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, ${CELL_VH}vh)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_VH}vh)`,
        }}
      >
        {allCharacters}
      </div>
    </main>
  );
};

const MemoizedClockgrid = memo(Clockgrid);
MemoizedClockgrid.displayName = 'Clock_25_10_23';
export default MemoizedClockgrid;
