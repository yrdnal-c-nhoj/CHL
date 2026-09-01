import fontUrl from '@/assets/fonts/26fonts/26-08-07.ttf?url';
import floorImage from '@/assets/images/26_images/26-08/26-08-07/floor.webp';
import wallImage from '@/assets/images/26_images/26-08/26-08-07/wall.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

// -----------------------------------------------------------------------------
// ASSETS
// -----------------------------------------------------------------------------
export const assets: string[] = [floorImage, wallImage, fontUrl];
const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont_26_08_07', fontUrl }];

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
type FallState = 'idle' | 'shaking' | 'falling' | 'fading';

interface CharacterState {
  state: FallState;
  fallAt: number; // Timestamp to start falling
  shakeAt: number; // Timestamp to start shaking
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
const Clock_26_08_07 = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();

  // Current time string (always up-to-date)
  const { timeString, ampm, accessibleTime, fullString } = useMemo(() => {
    const hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = String(hours % 12 || 12);
    const timeString = `${hours12}:${minutes}`;

    return {
      timeString,
      ampm,
      accessibleTime: `${hours % 12 || 12}:${minutes} ${ampm}`,
      fullString: timeString + ampm,
    };
  }, [time]);

  const [charStates, setCharStates] = useState<CharacterState[]>(() =>
    Array(fullString.length)
      .fill(null)
      .map(() => ({ state: 'idle', fallAt: Infinity, shakeAt: Infinity }))
  );

  // Ref to hold timers to ensure they are cleared on unmount/re-run
  const animationTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Animation cycle: trigger a full cascade of falling characters using rAF
  useEffect(() => {
    let animationFrameId: number;
    let lastCascadeTime = 0;
    const CASCADE_INTERVAL = 10000; // Start a new cascade every 10 seconds

    const animate = (timestamp: number) => {
      // 1. Trigger a new cascade at intervals
      if (timestamp - lastCascadeTime > CASCADE_INTERVAL) {
        lastCascadeTime = timestamp;

        const indices = fullString.split('').map((_, i) => i);
        const shuffled = indices.sort(() => Math.random() - 0.5);

        const hasDelayedFinale = Math.random() > 0.25;
        const lastToFallIndex = hasDelayedFinale ? shuffled.pop() : null;

        setCharStates((prev) => {
          const next = [...prev];
          let maxFallDelay = 0;

          // Schedule main group
          shuffled.forEach((charIndex) => {
            const fallDelay = 1000 + Math.random() * 2000;
            if (fallDelay > maxFallDelay) maxFallDelay = fallDelay;
            if (next[charIndex]) {
              next[charIndex]!.shakeAt = timestamp + fallDelay;
              next[charIndex]!.fallAt = timestamp + fallDelay + 1800;
            }
          });

          // Schedule finale
          if (lastToFallIndex !== null && next[lastToFallIndex]) {
            const lastFallTime = maxFallDelay + 1800 + 1500 + 2000;
            next[lastToFallIndex]!.shakeAt = timestamp + lastFallTime;
            next[lastToFallIndex]!.fallAt = timestamp + lastFallTime + 1800;
          }

          return next;
        });
      }

      // 2. Update character states based on timestamps
      setCharStates((prev) =>
        prev.map((char, i) => {
          if (char.state === 'fading' && timestamp > char.fallAt + 1500 + 200) {
            return { state: 'idle', fallAt: Infinity, shakeAt: Infinity };
          }
          if (char.state === 'falling' && timestamp > char.fallAt + 1500) {
            return { ...char, state: 'fading' };
          }
          if (char.state === 'shaking' && timestamp > char.fallAt) {
            return { ...char, state: 'falling' };
          }
          if (char.state === 'idle' && timestamp > char.shakeAt) {
            return { ...char, state: 'shaking' };
          }
          return char;
        }),
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [fullString]); // Rerun if the time string format changes (e.g. 9:59 -> 10:00)

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${wallImage})` }}
    >
      <div className={styles.floor} style={{ backgroundImage: `url(${floorImage})` }} />

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {accessibleTime}
      </time>

      <div className={styles.digitalClock}>
        <div className={styles.time}>
          {timeString.split('').map((char, i) => (
            <span
              key={`t-${i}`}
              className={`${styles.char} ${styles[charStates[i]?.state] ?? ''}`}
            >
              {char}
            </span>
          ))}
        </div>

        <div className={styles.ampm}>
          {ampm.split('').map((char, i) => (
            <span
              key={`a-${i}`}
              className={`${styles.char} ${styles[charStates[i + timeString.length]?.state] ?? ''
              }`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
};

const MemoizedClock_26_08_07 = memo(Clock_26_08_07);
MemoizedClock_26_08_07.displayName = 'Clock_26_08_07';

export default MemoizedClock_26_08_07;