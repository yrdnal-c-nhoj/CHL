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
type CharacterStates = FallState[];

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
const Clock_26_08_07 = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const [charStates, setCharStates] = useState<CharacterStates>([]);

  // Ref to hold timers to ensure they are cleared on unmount/re-run
  const animationTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  // Initialize or update character states when the string length changes
  useEffect(() => {
    setCharStates(Array(fullString.length).fill('idle'));
  }, [fullString.length]);

  // Animation cycle: trigger a full cascade of falling characters
  useEffect(() => {
    // Function to clear all scheduled animation timers
    const clearTimers = () => {
      animationTimers.current.forEach(clearTimeout);
      animationTimers.current = [];
    };

    // Main animation sequence orchestrator
    const startCascade = () => {
      clearTimers(); // Ensure no old timers are running

      // --- New Randomized Timing Logic ---
      // 1. All characters are now eligible to be part of the main animation group.
      const allIndices = fullString.split('').map((_, i) => i);

      // 2. Shuffle all indices to randomize their roles.
      for (let i = allIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
      }

      // 3. Decide if there will be a delayed final character.
      const hasDelayedFinale = Math.random() > 0.25; // 75% chance of a finale
      let lastToFallIndex: number | null = null;
      const mainGroupIndices = allIndices;

      if (hasDelayedFinale && allIndices.length > 1) {
        lastToFallIndex = allIndices.pop()!;
      }

      if (mainGroupIndices.length === 0) return;

      // Function to trigger a character's fall sequence
      const triggerFall = (charIndex: number) => {
        const SHAKE_DURATION = 1800; // ms
        // Start shaking
        setCharStates((prev) => {
          const next = [...prev];
          if (next[charIndex] === 'idle') next[charIndex] = 'shaking';
          return next;
        });
        // After shaking, start falling
        const fallAnimTimer = setTimeout(() => {
          setCharStates((prev) => {
            const next = [...prev];
            if (next[charIndex] === 'shaking') next[charIndex] = 'falling';
            return next;
          });
          // After falling, start fading immediately
          const fadeTimer = setTimeout(() => {
            setCharStates((prev) => {
              const next = [...prev];
              if (next[charIndex] === 'falling') next[charIndex] = 'fading';
              return next;
            });
          }, FALL_ANIMATION_DURATION);
          animationTimers.current.push(fadeTimer);
        }, SHAKE_DURATION);
        animationTimers.current.push(fallAnimTimer);
      };

      // 4. The first character from the shuffled main group falls immediately.
      const firstToFallIndex = mainGroupIndices.shift()!;
      triggerFall(firstToFallIndex);

      // 5. Trigger the rest of the main group at random intervals.
      let maxFallDelay = 0;
      mainGroupIndices.forEach((charIndex) => {
        // Stagger the rest of the falls over a random window starting after the first one.
        const fallDelay = 1000 + Math.random() * 2000; // Random delay between 1 and 3 seconds
        if (fallDelay > maxFallDelay) maxFallDelay = fallDelay;

        const fallTimer = setTimeout(() => {
          triggerFall(charIndex);
        }, fallDelay);
        animationTimers.current.push(fallTimer);
      });

      // --- Sequence Finale: Last Character Fall, Fade Out, and Reset ---

      const FALL_ANIMATION_DURATION = 1500;
      const SHAKE_DURATION = 1800;
      const FADE_DURATION = 200;

      // Time when the last character of the main group has finished its fall animation
      const lastDigitLandedTime = maxFallDelay + SHAKE_DURATION + FALL_ANIMATION_DURATION;

      // 6. Schedule the final, randomly chosen character to fall after the main group lands.
      if (lastToFallIndex !== null) {
        const lastFallTimer = setTimeout(() => {
          triggerFall(lastToFallIndex!);
        }, lastDigitLandedTime + 2000);
        animationTimers.current.push(lastFallTimer);
      }

      // Schedule the final reset after all animations (including fade) are complete for the colon.
      const resetTimer = setTimeout(() => {
        setCharStates(Array(fullString.length).fill('idle'));

        // Schedule the next cascade to start 1 second after this reset.
        const nextCascadeTimer = setTimeout(startCascade, 1000);
        animationTimers.current.push(nextCascadeTimer);
      }, lastDigitLandedTime + 2000 + SHAKE_DURATION + FALL_ANIMATION_DURATION + FADE_DURATION);
      animationTimers.current.push(resetTimer);
    };

    // Start the first cascade after an initial delay. Subsequent cascades are chained.
    const initial = setTimeout(startCascade, 2500);
    animationTimers.current.push(initial);

    return () => {
      clearTimers();
    };
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
              className={`${styles.char} ${styles[charStates[i]] ?? ''}`}
            >
              {char}
            </span>
          ))}
        </div>

        <div className={styles.ampm}>
          {ampm.split('').map((char, i) => (
            <span
              key={`a-${i}`}
              className={`${styles.char} ${
                styles[charStates[i + timeString.length]] ?? ''
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