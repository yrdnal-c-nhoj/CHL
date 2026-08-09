import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { memo, useMemo } from 'react';

// 1. Asset Exports
export const assets: string[] = [];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [];

// -----------------------------------------------------------------------------
// WALL
// -----------------------------------------------------------------------------

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  minHeight: '100dvh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  perspective: '1000px', // Add perspective to the room

  // Concrete / plaster wall
  backgroundColor: '#9b9992',

  backgroundImage: `
    radial-gradient(
      ellipse at 35% 30%,
      rgba(255,255,255,0.08) 0%,
      rgba(255,255,255,0) 45%
    ),
    radial-gradient(
      ellipse at 70% 75%,
      rgba(0,0,0,0.10) 0%,
      rgba(0,0,0,0) 55%
    ),
    repeating-linear-gradient(
      97deg,
      rgba(255,255,255,0.018) 0,
      rgba(255,255,255,0.018) 0.08rem,
      rgba(0,0,0,0.018) 0.08rem,
      rgba(0,0,0,0.018) 0.16rem
    ),
    repeating-linear-gradient(
      13deg,
      rgba(255,255,255,0.012) 0,
      rgba(255,255,255,0.012) 0.12rem,
      rgba(0,0,0,0.012) 0.12rem,
      rgba(0,0,0,0.012) 0.24rem
    )
  `,
};

// -----------------------------------------------------------------------------
// FLOOR
// -----------------------------------------------------------------------------

const floorStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '25%', // Take up the bottom quarter
  transformOrigin: 'bottom center',
  transform: 'rotateX(60deg)', // Apply perspective to the floor
  zIndex: 0,

  // Wood floor texture
  backgroundColor: '#5C3D2E',
  backgroundImage: `
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.07) 0,
      rgba(255, 255, 255, 0.07) 1px,
      transparent 1px,
      transparent 20%
    ),
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 0,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 2px
    ),
    linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%)
  `,
};

// -----------------------------------------------------------------------------
// CLOCK
// -----------------------------------------------------------------------------

const digitalClockStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',

  color: '#8b8982',

  fontFamily: "'Courier New', Courier, monospace",
  fontVariantNumeric: 'tabular-nums',

  /*
   * The entire clock sits against the wall.
   * The shadows belong to the lettering itself, creating the illusion
   * that the wall has been physically cut away.
   */
  filter: 'contrast(1.05)',
};

// -----------------------------------------------------------------------------
// MAIN TIME
// -----------------------------------------------------------------------------

const timeStyle: React.CSSProperties = {
  position: 'relative',

  fontSize: '15vmin',
  fontWeight: 900,
  letterSpacing: '0.02em',
  lineHeight: 0.9,

  color: '#85837d',

  /*
   * Recessed / carved effect.
   *
   * Upper-left:
   *   light catches the inside edge of the cut.
   *
   * Lower-right:
   *   deep occlusion makes the cavity look deeper.
   *
   * The very subtle dark outer shadow makes the wall around the
   * cut-out feel physically displaced.
   */
  textShadow: `
    -0.10rem -0.10rem 0.08rem rgba(255,255,255,0.34),
     0.10rem  0.10rem 0.12rem rgba(0,0,0,0.42),
     0.18rem  0.22rem 0.35rem rgba(0,0,0,0.28),
    -0.18rem -0.18rem 0.28rem rgba(255,255,255,0.10),
     0 0.35rem 0.65rem rgba(0,0,0,0.18)
  `,
};

// -----------------------------------------------------------------------------
// AM / PM
// -----------------------------------------------------------------------------

const ampmStyle: React.CSSProperties = {
  position: 'relative',

  fontSize: '8vmin',
  marginLeft: '2vmin',
  fontWeight: 900,
  lineHeight: 0.9,

  color: '#85837d',

  textShadow: `
    -0.08rem -0.08rem 0.06rem rgba(255,255,255,0.32),
     0.08rem  0.08rem 0.10rem rgba(0,0,0,0.42),
     0.14rem  0.18rem 0.28rem rgba(0,0,0,0.25),
    -0.12rem -0.12rem 0.20rem rgba(255,255,255,0.08)
  `,
};

// -----------------------------------------------------------------------------
// ACCESSIBILITY
// -----------------------------------------------------------------------------

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

const ClockComponent: React.FC = () => {
  const time = useSecondClock();

  useSuspenseFontLoader(fontConfigs);

  const { timeString, ampm, minutesPadded } = useMemo(() => {
    const hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    const hours12 = String(hours % 12 || 12).padStart(2, '0');

    return {
      timeString: `${hours12}:${minutes}`,
      ampm,
      minutesPadded: minutes,
    };
  }, [time]);

  const accessibleTimeString = `${time.getHours()}:${minutesPadded}`;

  return (
    <main style={containerStyle}>
      {/* Floor element */}
      <div style={floorStyle} />

      {/* Semantic element for accessibility */}
      <time dateTime={time.toISOString()} style={srOnlyStyle}>
        {accessibleTimeString}
      </time>

      {/* Recessed wall clock */}
      <div style={digitalClockStyle}>
        <span style={timeStyle}>
          {timeString}
        </span>

        <span style={ampmStyle}>
          {ampm}
        </span>
      </div>
    </main>
  );
};

// -----------------------------------------------------------------------------
// PERFORMANCE
// -----------------------------------------------------------------------------

const MemoizedClock = memo(ClockComponent);

MemoizedClock.displayName = 'Clock_26_08_07';

export default MemoizedClock;