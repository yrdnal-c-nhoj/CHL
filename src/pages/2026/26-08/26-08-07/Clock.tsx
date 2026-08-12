import fontUrl from '@/assets/fonts/26fonts/26-08-07.ttf?url';
import floorImage from '@/assets/images/26_images/26-08/26-08-07/floor.webp';
import wallImage from '@/assets/images/26_images/26-08/26-08-07/wall.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// -----------------------------------------------------------------------------
// ASSETS
// -----------------------------------------------------------------------------
export const assets: string[] = [floorImage, wallImage, fontUrl];
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_07', fontUrl },
];

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: '22dvh',
  justifyContent: 'center',
  userSelect: 'none',
  perspective: '1000px',
  perspectiveOrigin: '50% 30%',
  backgroundColor: '#9b9992',
  backgroundImage: `url(${wallImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const floorStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '40%',
  zIndex: 0,
  backgroundImage: `url(${floorImage})`,
  backgroundSize: '100% 100%',
  backgroundPosition: 'center bottom',
};

const digitalClockStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  fontFamily: "'ClockFont_26_08_07', 'Courier New', Courier, monospace",
  fontVariantNumeric: 'tabular-nums',
  filter: 'contrast(1.08)',
  transformStyle: 'preserve-3d',
  transform: 'rotateX(2deg) translateZ(10px)',
};

/* 
 * Deep 3D Carved & Extruded Bevel Effect:
 * 1. Top light highlights (-0.02em -0.02em) for sharp chiseled edges.
 * 2. Multi-layered offset extrusion steps extending back toward the wall.
 * 3. Wall ambient occlusion (dark shadow right behind the block).
 * 4. Deep directional drop shadow projecting onto the wall surface.
 */
const textShadow = `
  /* Top-down lighting with a sharp bottom shadow */
  -0.01em -0.01em 0px rgba(255, 255, 255, 0.5), /* Subtle top highlight */
  
  /* Bottom Bevel/Edge */
  0em 0.02em 0px #C86060,
  0em 0.04em 0px #AD4646,
  0em 0.06em 0px #903131,
  
  /* Sharp, defined drop shadow directly underneath */
  0em 0.12em 4px rgba(0, 0, 0, 0.5)
`;

const textBaseStyle: React.CSSProperties = {
  position: 'relative',
  fontSize: '15vmin',
  fontWeight: 900,
  lineHeight: 0.9,
  color: '#E57373', // Main front face color
  textShadow,
  transformStyle: 'preserve-3d',
};

const timeStyle: React.CSSProperties = {
  ...textBaseStyle,
  letterSpacing: '0.04em',
};

const ampmStyle: React.CSSProperties = {
  ...textBaseStyle,
  marginLeft: '2.5vmin',
};

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// -----------------------------------------------------------------------------
// KEYFRAMES
// -----------------------------------------------------------------------------
const keyframes = `
  @keyframes shake {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    15%      { transform: translate(-3px, 2px) rotate(-4deg); }
    30%      { transform: translate(3px, -2px) rotate(4deg); }
    45%      { transform: translate(-4px, -1px) rotate(-6deg); }
    60%      { transform: translate(4px, 2px) rotate(5deg); }
    75%      { transform: translate(-2px, 3px) rotate(-3deg); }
    90%      { transform: translate(2px, -3px) rotate(3deg); }
  }

  @keyframes realisticBounce {
    0% {
      transform: translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1, 1);
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    35% {
      transform: translateY(49vh) translateZ(15px) rotateX(86deg) rotateY(-18deg) rotateZ(-12deg) scale(1.1, 0.75);
      text-shadow: -8px 6px 4px rgba(0,0,0,0.6);
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    52% {
      transform: translateY(38vh) translateZ(35px) rotateX(78deg) rotateY(12deg) rotateZ(-4deg) scale(0.95, 1.05);
      text-shadow: -15px 22px 18px rgba(0,0,0,0.2);
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    68% {
      transform: translateY(49vh) translateZ(12px) rotateX(88deg) rotateY(-10deg) rotateZ(3deg) scale(1.04, 0.92);
      text-shadow: -6px 8px 5px rgba(0,0,0,0.5);
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    80% {
      transform: translateY(44vh) translateZ(20px) rotateX(84deg) rotateY(2deg) rotateZ(8deg) scale(1, 1);
      text-shadow: -9px 13px 10px rgba(0,0,0,0.3);
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    90% {
      transform: translateY(49vh) translateZ(10px) rotateX(89deg) rotateY(-4deg) rotateZ(9deg) scale(1, 1);
      text-shadow: -4px 8px 6px rgba(0,0,0,0.48);
      animation-timing-function: ease-out;
    }
    100% {
      transform: translateY(48vh) translateZ(15px) rotateX(88deg) rotateY(15deg) rotateZ(-20deg) scale(1, 1);
      text-shadow: 10px 10px 8px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3);
    }
  }
`;

const AnimationStyles = memo(() => <style>{keyframes}</style>);
AnimationStyles.displayName = 'AnimationStyles';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
type FallState = 'idle' | 'shaking' | 'falling' | 'fading';
type CharacterStates = FallState[];

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
const Clock_26_08_07: React.FC = () => {
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
    const hours12 = String(hours % 12 || 12).padStart(2, '0');
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

      const eligibleIndices = fullString
      .split('')
      .map((char, i) => (char === ':' ? -1 : i))
      .filter((i) => i !== -1);

      if (eligibleIndices.length === 0) return;

      const colonIndex = fullString.indexOf(':');

      // --- New Randomized Timing Logic ---

      // 1. The first digit always falls first, alone.
      const firstToFallIndex = eligibleIndices.shift()!; // Remove the first digit from the list

      // 2. The rest of the characters are shuffled for a random fall order.
      const remainingIndices = eligibleIndices;
      for (let i = remainingIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingIndices[i], remainingIndices[j]] = [remainingIndices[j], remainingIndices[i]];
      }

      // Function to trigger a character's fall sequence
      const triggerFall = (charIndex: number) => {
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
        }, 1800); // SHAKE_DURATION
        animationTimers.current.push(fallAnimTimer);
      };

      // 3. Trigger the first digit immediately.
      triggerFall(firstToFallIndex);

      // 4. Trigger the rest of the characters at random intervals.
      let maxFallDelay = 0;
      remainingIndices.forEach((charIndex) => {
        // Stagger the rest of the falls over a random window starting after the first one.
        const fallDelay = 1000 + Math.random() * 2000; // Random delay between 1 and 3 seconds
        if (fallDelay > maxFallDelay) maxFallDelay = fallDelay;

        const fallTimer = setTimeout(() => {
          triggerFall(charIndex);
        }, fallDelay);
        animationTimers.current.push(fallTimer);
      });

      // --- Sequence Finale: Colon Fall, Fade Out, and Reset ---

      const FALL_ANIMATION_DURATION = 1500; // ms
      const SHAKE_DURATION = 1800; // ms
      const FADE_DURATION = 200; // ms (from CSS transition)

      // Time when the last digit has finished its fall animation
      const lastDigitLandedTime = maxFallDelay + SHAKE_DURATION + FALL_ANIMATION_DURATION;

      // 5. Schedule the colon to fall 2 seconds after the last digit lands.
      const colonFallTimer = setTimeout(() => {
        if (colonIndex === -1) return;
        // Start shaking colon
        setCharStates((prev) => {
          const next = [...prev];
          next[colonIndex] = 'shaking';
          return next;
        });
        // After shaking, start falling
        const colonAnimTimer = setTimeout(() => {
          setCharStates((prev) => {
            const next = [...prev];
            next[colonIndex] = 'falling';
            return next;
          });
          // After falling, start fading immediately
          const fadeTimer = setTimeout(() => {
            setCharStates((prev) => {
              const next = [...prev];
              if (next[colonIndex] === 'falling') next[colonIndex] = 'fading';
              return next;
            });
          }, FALL_ANIMATION_DURATION);
          animationTimers.current.push(fadeTimer);
        }, SHAKE_DURATION);
        animationTimers.current.push(colonAnimTimer);
      }, lastDigitLandedTime + 2000);
      animationTimers.current.push(colonFallTimer);

      // Schedule the final reset after all animations (including fade) are complete for the colon.
      const resetTimer = setTimeout(() => {
        setCharStates(Array(fullString.length).fill('idle')); // Reset all to idle
      }, lastDigitLandedTime + 2000 + SHAKE_DURATION + FALL_ANIMATION_DURATION + FADE_DURATION);
      animationTimers.current.push(resetTimer);
    };

    // Start the first cascade after a delay, then repeat on a long interval
    const initial = setTimeout(startCascade, 2500);
    const interval = setInterval(startCascade, 25000);
    animationTimers.current.push(initial);

    return () => {
      clearTimers();
      clearInterval(interval);
    };
  }, [fullString]); // Rerun if the time string format changes (e.g. 9:59 -> 10:00)

  // Style for each character
  const getCharStyle = useCallback(
    (charIndex: number): React.CSSProperties => {
      const state = charStates[charIndex] ?? 'idle';

      if (state === 'idle') {
        return { display: 'inline-block' };
      }

      const base: React.CSSProperties = {
        display: 'inline-block',
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 100%',
        position: 'relative',
      };

      switch (state) {
        case 'shaking':
          return {
            ...base,
            animation: 'shake 0.15s ease-in-out infinite',
          };
        case 'falling':
          return {
            ...base,
            zIndex: 10,
            animation: 'realisticBounce 1.5s linear forwards',
            // When the animation ends, it will hold the 100% frame style
          };
        case 'fading':
          return {
            ...base,
            zIndex: 10,
            transform: 'translateY(48vh) translateZ(15px) rotateX(88deg) rotateY(15deg) rotateZ(-20deg)',
            textShadow: '10px 10px 8px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3)',
            opacity: 0,
            transition: 'opacity 0.2s ease-out',
          };
        default:
          return base;
      }
    },
    [charStates]
  );

  return (
    <main style={containerStyle}>
      <AnimationStyles />
      <div style={floorStyle} />

      <time dateTime={time.toISOString()} style={srOnlyStyle}>
        {accessibleTime}
      </time>

      <div style={digitalClockStyle}>
        <div style={timeStyle}>
          {timeString.split('').map((char, i) => (
            <span key={`t-${i}`} style={getCharStyle(i)}>
              {char}
            </span>
          ))}
        </div>

        <div style={ampmStyle}>
          {ampm.split('').map((char, i) => (
            <span
              key={`a-${i}`}
              style={getCharStyle(i + timeString.length)}
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