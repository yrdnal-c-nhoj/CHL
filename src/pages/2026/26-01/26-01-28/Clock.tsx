import { memo, useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import type { FontConfig } from '@/types/clock';
import backgroundImage from '@/assets/images/26_images/26-01/26-01-28/three.webp';
import styles from './Clock.module.css';

export const assets = [backgroundImage];

const font260128Name = 'Big Shoulders Inline Text';

export const fontConfigs: FontConfig[] = [];

function CheckerboardBackground() {
  const tileSize = 200;
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / tileSize) + 2,
        rows: Math.ceil(window.innerHeight / tileSize) + 2,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderedTiles = useMemo(() => {
    const tiles = [];
    const startCol = -Math.floor(dimensions.cols / 2);
    const startRow = -Math.floor(dimensions.rows / 2);

    for (let r = 0; r < dimensions.rows; r++) {
      for (let c = 0; c < dimensions.cols; c++) {
        const currCol = startCol + c;
        const currRow = startRow + r;
        const flipH = Math.abs(currCol) % 2 === 1;
        const flipV = Math.abs(currRow) % 2 === 1;
        const transform = `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`;

        tiles.push(
          <div key={`${currRow}-${currCol}`} className={styles.tile} style={{
            width: tileSize,
            height: tileSize,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            transform,
            opacity: 0.2,
          }} />
        );
      }
    }
    return tiles;
  }, [dimensions]);

  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.tileGrid} style={{
        gridTemplateColumns: `repeat(${dimensions.cols}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${dimensions.rows}, ${tileSize}px)`,
      }}>
        {renderedTiles}
      </div>
    </div>
  );
}

function useClockAngles() {
  const now = useMillisecondClock();
  return useMemo(() => {
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 24) + m / 60;
    return {
      hourAngle: h * 15,
      minAngle: m * 6,
      secAngle: s * 6,
    };
  }, [now]);
}

const ThreeSingleHandClocks = () => {
  const { hourAngle, minAngle, secAngle } = useClockAngles();
  const [layout, setLayout] = useState<'row' | 'column'>('row');
  const [clockSize, setClockSize] = useState(0);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nextLayout = w < 900 ? 'column' : 'row';
      setLayout(nextLayout);
      const diameter = nextLayout === 'row'
        ? Math.min((w / 3) * 0.8, h * 0.7)
        : Math.min(w * 0.8, (h / 3) * 0.7);
      setClockSize(diameter);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className={styles.container}>
      <time dateTime={new Date().toISOString()} className={styles.srOnly}>{new Date().toLocaleTimeString()}</time>
      <CheckerboardBackground />
      <div className={styles.clockGrid} style={{ flexDirection: layout, gap: layout === 'column' ? '0vh' : '0vw', zIndex: 10 }}>
        <Clock label="SECONDS" angle={secAngle} color="#FAD903" thickness="14%" maxUnits={60} step={1} smooth={false} clockSize={clockSize} font260128Name={font260128Name} />
        <Clock label="HOURS" angle={hourAngle} color="#FF0000" thickness="18%" maxUnits={24} step={1} clockSize={clockSize} font260128Name={font260128Name} />
        <Clock label="MINUTES" angle={minAngle} color="#1693FA" thickness="16%" maxUnits={60} step={1} clockSize={clockSize} font260128Name={font260128Name} />
      </div>
    </main>
  );
};

interface ClockProps {
  angle: number;
  color: string;
  thickness: string;
  smooth?: boolean;
  maxUnits: number;
  step: number;
  clockSize: number;
  font260128Name: string;
  label?: string;
}

const Clock = ({ angle, color, thickness, smooth = true, maxUnits, step, clockSize, font260128Name, label }: ClockProps) => {
  const markers = useMemo(() => {
    const arr = [];
    for (let i = step; i <= maxUnits; i += step) arr.push(i);
    return arr;
  }, [maxUnits, step]);

  const transitionStyle = smooth ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  const borderWeight = 6;
  const massiveHeight = '200vh';

  return (
    <div className={styles.face} style={{ width: clockSize, height: clockSize }}>
      <div className={styles.hand} style={{
        width: `calc(${thickness} + ${borderWeight * 2}px)`,
        height: massiveHeight,
        backgroundColor: '#F7F3F3',
        border: '1px solid #000000',
        borderRadius: '18px',
        transform: `translateX(-50%) rotate(${angle}deg)`,
        transition: transitionStyle,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${borderWeight}px`,
      }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: color, borderRadius: '18px' }} />
      </div>

      {markers.map((num) => {
        const rotation = num * (360 / maxUnits) - 90;
        const radius = (clockSize / 2) * 1.8;
        return (
          <div key={num} className={styles.marker} style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg) translateX(${radius}px) rotate(${-rotation}deg)`,
            fontSize: `calc(${clockSize}px * 0.13)`,
            fontFamily: `'${font260128Name}', sans-serif`,
            color: '#1A6804',
            mixBlendMode: 'difference',
            zIndex: 22,
            pointerEvents: 'none',
          }}>
            {num}
          </div>
        );
      })}
    </div>
  );
};

const MemoizedThreeSingleHandClocks = memo(ThreeSingleHandClocks);
MemoizedThreeSingleHandClocks.displayName = 'Clock_26_01_28';
export default MemoizedThreeSingleHandClocks;
