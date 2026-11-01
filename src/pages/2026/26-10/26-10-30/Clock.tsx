import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import SRTime from '@/components/SRTime';
import { useClock, useSmoothClock } from '@/utils/hooks';
import { useClockAngles } from '@/hooks/useClockAngles';
import styles from './Clock.module.css';
import ClockHand from './Clockhand';

import swipeImage1 from '@/assets/images/26_images/26-10/26-10-30/swipe1.webp';
import swipeImage2 from '@/assets/images/26_images/26-10/26-10-30/swipe2.webp';
import swipeImage3 from '@/assets/images/26_images/26-10/26-10-30/swipe3.webp';
import swipeImage4 from '@/assets/images/26_images/26-10/26-10-30/swipe4.webp';
import swipeImage5 from '@/assets/images/26_images/26-10/26-10-30/swipe5.webp';
import swipeImage6 from '@/assets/images/26_images/26-10/26-10-30/swipe6.webp';
import swipeImage7 from '@/assets/images/26_images/26-10/26-10-30/swipe7.webp';

export const assets = [
  swipeImage1,
  swipeImage2,
  swipeImage3,
  swipeImage4,
  swipeImage5,
  swipeImage6,
  swipeImage7,
];

const swipeImages = [
  swipeImage1,
  swipeImage2,
  swipeImage3,
  swipeImage4,
  swipeImage5,
  swipeImage6,
  swipeImage7,
];

/* Seeded PRNG so decoration positions are deterministic per seed */
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface DecorationSpec {
  id: number;
  src: string;
  left: number;
  top: number;
  size: number;
  rotation: number;
}

/* How many passes of swipe images render. */
const TOTAL_COUNT = swipeImages.length * 4; // 28 on laptop
const PHONE_COUNT = swipeImages.length * 3; // 21 on phone
const SWAP_COUNT = 5;

/* ==========================================================================
 * DecorationLayer
 * Keeps decoration state isolated so viewport changes can reset the layer
 * without synchronously updating state inside an effect.
 * ========================================================================== */

interface DecorationLayerProps {
  activeCount: number;
  time: Date;
  reducedMotion: boolean;
}

const DecorationLayer = ({
  activeCount,
  time,
  reducedMotion,
}: DecorationLayerProps) => {
  const rng = useMemo(() => mulberry32(0x261028), []);

  const makeDecoration = useCallback(
    (id: number): DecorationSpec => {
      const idx = Math.floor(rng() * swipeImages.length);
      const src = swipeImages[idx] ?? swipeImage1;

      return {
        id,
        src,
        left: rng() * 90 + 5,
        top: rng() * 90 + 5,
        size: rng() * 12 + 10,
        rotation: rng() * 360,
      };
    },
    [rng],
  );

  const [decorations, setDecorations] = useState<DecorationSpec[]>(() => {
    const initial: DecorationSpec[] = [];

    for (let i = 0; i < activeCount; i += 1) {
      initial.push(makeDecoration(i));
    }

    return initial;
  });

  const lastSecondRef = useRef(time.getSeconds());

  useEffect(() => {
    if (reducedMotion) {
      lastSecondRef.current = time.getSeconds();
      return;
    }

    const currentSecond = time.getSeconds();

    if (currentSecond === lastSecondRef.current) {
      return;
    }

    lastSecondRef.current = currentSecond;

    setDecorations((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      // Shuffle indices to select which decorations disappear.
      const indices = Array.from({ length: prev.length }, (_, index) => index);

      for (let i = indices.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));

        const valI = indices[i];
        const valJ = indices[j];

        if (valI !== undefined && valJ !== undefined) {
          indices[i] = valJ;
          indices[j] = valI;
        }
      }

      const toRemoveIds = new Set<number>();

      for (let k = 0; k < Math.min(SWAP_COUNT, prev.length); k += 1) {
        const idx = indices[k];

        if (idx !== undefined) {
          const item = prev[idx];

          if (item) {
            toRemoveIds.add(item.id);
          }
        }
      }

      const remaining = prev.filter(
        (decoration) => !toRemoveIds.has(decoration.id),
      );

      // Create replacement decorations with new positions and sizes.
      const baseId =
        prev.length > 0
          ? Math.max(...prev.map((decoration) => decoration.id)) + 1
          : 0;

      const reappeared: DecorationSpec[] = [];

      for (let i = 0; i < Math.min(SWAP_COUNT, prev.length); i += 1) {
        reappeared.push(makeDecoration(baseId + i));
      }

      return [...remaining, ...reappeared];
    });
  }, [time, reducedMotion, makeDecoration, rng]);

  return (
    <>
      {decorations.map((decoration) => {
        const isInverted =
          decoration.src === swipeImage2 ||
          decoration.src === swipeImage3 ||
          decoration.src === swipeImage4;

        return (
          <img
            key={decoration.id}
            src={decoration.src}
            alt=""
            className={`${styles.decoration} ${
              isInverted ? styles.inverted : ''
            }`}
            style={{
              left: `${decoration.left}vw`,
              top: `${decoration.top}vh`,
              width: `${decoration.size}vw`,
              height: `${decoration.size}vw`,
              transform: `rotate(${decoration.rotation}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/* ==========================================================================
 * Clock_26_10_30
 * Analog clock with stylized SVG hands and decorative swipe images.
 * Five decorations are replaced every second.
 * ========================================================================== */

const Clock_26_10_30 = () => {
  // Smooth clock for hand animation.
  const smoothTime = useSmoothClock(16);
  const { hourAngle, minAngle, secAngle } = useClockAngles(smoothTime);

  // useClock fires every second and drives the decoration swaps.
  const time = useClock();

  // Phone vs laptop detection via media query.
  const [isPhone, setIsPhone] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const update = () => {
      setIsPhone(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  // Respect prefers-reduced-motion.
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  const activeCount = isPhone ? PHONE_COUNT : TOTAL_COUNT;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.dial} aria-hidden="true">
        <div className={styles.face}>
          {/* Hour hand */}
          <ClockHand
            className={`${styles.hand} ${styles.hourHand}`}
            angle={hourAngle}
          />

          {/* Minute hand */}
          <ClockHand
            className={`${styles.hand} ${styles.minuteHand}`}
            angle={minAngle}
          />

          {/* Second hand */}
          <ClockHand
            className={`${styles.hand} ${styles.secondHand}`}
            angle={secAngle}
            variant="finger"
          />

          {/* Center hand — rotates counterclockwise with the second hand */}
          <div
            className={styles.centerHand}
            style={{
              transform: `translate(-50%, -50%) rotate(${-secAngle}deg)`,
            }}
          >
            <svg
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="center-skin"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#b8860b" />
                  <stop offset="25%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="75%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>

              <g transform="translate(82, -35) scale(3)">
                <path
                  d="
                    M 43 170
                    L 43 120
                    Q 35 115 29 105
                    L 16 80
                    Q 12 72 18 68
                    Q 24 64 29 73
                    L 39 88
                    L 34 40
                    Q 33 29 40 28
                    Q 47 27 48 40
                    L 50 78
                    L 52 20
                    Q 52 9 59 9
                    Q 66 9 66 20
                    L 65 78
                    L 69 35
                    Q 70 24 77 26
                    Q 84 28 82 39
                    L 77 90
                    L 85 60
                    Q 88 50 94 54
                    Q 100 58 97 69
                    L 87 112
                    Q 83 132 72 145
                    L 72 170
                    Z
                  "
                  fill="url(#center-skin)"
                  stroke="#8c6235"
                  strokeWidth="0.5"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Viewport-distributed decorative swipe images */}
      <DecorationLayer
        key={isPhone ? 'phone' : 'desktop'}
        activeCount={activeCount}
        time={time}
        reducedMotion={reducedMotion}
      />
    </main>
  );
};

Clock_26_10_30.displayName = 'Clock_26_10_30';

export default Clock_26_10_30;
