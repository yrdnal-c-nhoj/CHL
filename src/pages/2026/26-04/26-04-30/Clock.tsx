import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';

import pleiadesFont from '@/assets/fonts/26fonts/26-04-30-pleides.otf';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';

// --- Types & Constants ---

type AnimType = 'twinkle' | 'pulse' | 'flicker';
type ColorType = 'white' | 'blue' | 'gold';

interface StarPair {
  id: number;
  startX: string;
  startY: string;
  angle: number;
  duration: number;
  length: number;
  distance: number;
  key: number;
}

const STAR_COUNT = 150;
const formatDigits = (num: number): string => num.toString().padStart(2, '0');

const positions = [
  { top: '35%', left: '44%' }, // 0: Hour tens - Atlas (upper left of cluster)
  { top: '32%', left: '52%' }, // 1: Hour ones - Pleione (upper right, near Atlas)
  { top: '50%', left: '50%' }, // 2: Minute ones - Alcyone (center, brightest)
  { top: '45%', left: '58%' }, // 3: Minute tens - Merope (right of center)
  { top: '65%', left: '46%' }, // 4: A/P indicator - Electra (lower left)
  { top: '62%', left: '54%' }, // 5: M indicator - Maia (lower right)
] as const;

// --- Helper Functions ---

const generateRandomPair = (id: number, key: number): StarPair => ({
  id,
  startX: `${Math.random() * 100}%`,
  startY: `${Math.random() * 100}%`,
  angle: Math.random() * 360,
  duration: Math.random() * 0.8 + 0.4,
  length: Math.random() * 150 + 50,
  distance: Math.random() * 60 + 20,
  key,
});

// Pleiades cluster positions (7 sisters + Atlas/Pleione parents)
const PLEIADES_STARS = [
  { top: 35, left: 44, brightness: 0.9 }, // Atlas
  { top: 32, left: 52, brightness: 0.8 }, // Pleione
  { top: 50, left: 50, brightness: 1.0 }, // Alcyone (brightest)
  { top: 45, left: 58, brightness: 0.7 }, // Merope
  { top: 58, left: 42, brightness: 0.6 }, // Electra
  { top: 62, left: 56, brightness: 0.6 }, // Maia
  { top: 55, left: 48, brightness: 0.5 }, // Taygeta
  { top: 48, left: 40, brightness: 0.4 }, // Celeano
  { top: 40, left: 62, brightness: 0.4 }, // Sterope
];

const STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const rand = Math.random;
  const animRoll = rand();
  const colorRoll = rand();

  // 70% of stars clustered around Pleiades positions, 30% scattered
  const useCluster = rand() < 0.7;
  let top, left;

  if (useCluster) {
    const clusterIndex = Math.floor(rand() * PLEIADES_STARS.length);
    const cluster = PLEIADES_STARS[clusterIndex]!;
    const spread = 6; // degrees of spread around cluster center
    top = cluster.top + (rand() * spread * 2 - spread);
    left = cluster.left + (rand() * spread * 2 - spread);
  } else {
    top = rand() * 100;
    left = rand() * 100;
  }

  return {
    id: i,
    top: `${top}%`,
    left: `${left}%`,
    size: rand() * 2.5 + 0.5,
    opacity: rand() * 0.5 + 0.4,
    delay: rand() * 5,
    duration: rand() * 3 + 2,
    animType:
      animRoll > 0.8
        ? 'pulse'
        : animRoll > 0.6
          ? 'flicker'
          : ('twinkle' as AnimType),
    colorType:
      colorRoll > 0.9
        ? 'blue'
        : colorRoll > 0.8
          ? 'gold'
          : ('white' as ColorType),
  };
});

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Pleiades', fontUrl: pleiadesFont },
];

// --- Component ---

const PleiadesClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();
  const [starPairs, setStarPairs] = useState<StarPair[]>(() =>
    Array.from({ length: 24 }, (_, i) => generateRandomPair(i, 0)),
  );
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const regeneratePair = useCallback((id: number) => {
    const delay = Math.random() * 6000 + 2000;
    const timeout = setTimeout(() => {
      setStarPairs((prev) =>
        prev.map((p) => (p.id === id ? generateRandomPair(id, p.key + 1) : p)),
      );
    }, delay);
    timeoutsRef.current.add(timeout);
  }, []);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  const { hourTens, hourOnes, minuteTens, minuteOnes, isAM, isoTime } =
    useMemo(() => {
      let h = time.getHours();
      const isAM = h < 12;
      h = h % 12 || 12;
      const hStr = formatDigits(h);
      const mStr = formatDigits(time.getMinutes());
      const isoString = time.toISOString();
      return {
        hourTens: hStr[0],
        hourOnes: hStr[1],
        minuteTens: mStr[0],
        minuteOnes: mStr[1],
        isAM,
        isoTime: isoString,
      };
    }, [time]);

  const getStarClass = (animType: AnimType): string => {
    switch (animType) {
      case 'twinkle':
        return styles.starTwinkle ?? '';
      case 'pulse':
        return styles.starPulse ?? '';
      case 'flicker':
        return styles.starFlicker ?? '';
      default:
        return styles.starTwinkle ?? '';
    }
  };

  const getStarColor = (colorType: ColorType): string => {
    if (colorType === 'blue') return '#a8d0ff';
    if (colorType === 'gold') return '#ffd700';
    return '#fff';
  };

  const getStarBoxShadowColor = (colorType: ColorType): string => {
    if (colorType === 'white') return '#fff';
    return 'currentColor';
  };

  return (
    <div className={styles.container}>
      {/* Static Starfield */}
      {STARS.map((star) => (
        <span
          key={star.id}
          className={getStarClass(star.animType)}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: getStarColor(star.colorType),
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px ${getStarBoxShadowColor(star.colorType)}`,
          }}
        />
      ))}

      {/* Shooting Stars */}
      {starPairs.map((star) => (
        <span
          key={`${star.id}-${star.key}`}
          className={styles.shootingStar}
          style={
            {
              top: star.startY,
              left: star.startX,
              width: `${star.length}px`,
              '--star-angle': `${star.angle}deg`,
              '--star-duration': `${star.duration}s`,
              '--star-distance': `${star.distance}vw`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => regeneratePair(star.id)}
        />
      ))}

      {/* Digits and Indicators */}
      <time dateTime={isoTime} className={styles.timeWrapper}>
        <span
          className={`${styles.digit} ${styles.digitStandard}`}
          style={{
            top: positions[0].top,
            left: positions[0].left,
            animationDelay: '0s',
          }}
        >
          {hourTens}
        </span>
        <span
          className={`${styles.digit} ${styles.digitStandard}`}
          style={{
            top: positions[1].top,
            left: positions[1].left,
            animationDelay: '0.5s',
          }}
        >
          {hourOnes}
        </span>
        <span
          className={styles.colonStar}
          style={{ top: '42%', left: '43%', animationDelay: '1s' }}
        >
          ★
        </span>
        <span
          className={styles.colonStar}
          style={{ top: '46%', left: '43%', animationDelay: '1.5s' }}
        >
          ★
        </span>
        <span
          className={`${styles.digit} ${styles.digitStandard}`}
          style={{
            top: positions[2].top,
            left: positions[2].left,
            animationDelay: '2s',
          }}
        >
          {minuteTens}
        </span>
        <span
          className={`${styles.digit} ${styles.digitCenter} ${styles.digitBright}`}
          style={{
            top: positions[3].top,
            left: positions[3].left,
            animationDelay: '2.5s',
          }}
        >
          {minuteOnes}
        </span>

        <span
          className={`${styles.indicator} ${styles.indicatorActive} ${styles.indicatorTransition}`}
          style={{
            top: positions[4].top,
            left: positions[4].left,
            animationDelay: '3s',
          }}
        >
          {isAM ? 'A' : 'P'}
        </span>
        <span
          className={`${styles.indicator} ${styles.indicatorActive} ${styles.indicatorTransition}`}
          style={{
            top: positions[5].top,
            left: positions[5].left,
            animationDelay: '3.5s',
          }}
        >
          M
        </span>
      </time>
    </div>
  );
};

export default PleiadesClock;
