import fontUrl from '@/assets/fonts/26fonts/26-06-15.otf?url';
import { useClockTime } from '@/hooks/useClockTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo } from 'react';

/**
 * Assets to be preloaded for this clock.
 */
export const assets = [fontUrl];

const Clock: React.FC = () => {
  const time = useClockTime();

  // Load Pliant from Google Fonts for the hexadecimal numbers
  useEffect(() => {
    const linkId = 'google-font-pliant';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Pliant&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Define the font configuration for the suspense-based loader
  const fontConfigs: FontConfig[] = useMemo(
    () => [
      {
        fontFamily: 'ClockFont_26_06_15',
        fontUrl,
      },
    ],
    []
  );

  // Load and suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  // Format the time components as both decimal and 2-digit hexadecimal strings
  const timeParts = useMemo(() => {
    const toHex2 = (num: number): string => num.toString(16).toUpperCase().padStart(2, '0');
    const toDec2 = (num: number): string => num.toString().padStart(2, '0');

    return {
      h: { hex: toHex2(time.getHours()), dec: toDec2(time.getHours()) },
      m: { hex: toHex2(time.getMinutes()), dec: toDec2(time.getMinutes()) },
      s: { hex: toHex2(time.getSeconds()), dec: toDec2(time.getSeconds()) },
    };
  }, [time]);

  // FIXED: Consolidated into a single valid object literal

    const styles: Record<string, React.CSSProperties> = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#A007B4',
      // CHANGED: Use 'background' or 'backgroundImage' instead of 'gradient'
      background: 'radial-gradient(circle, #FFFC66 0%, #AFADAA 100%)',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
    },
    // ... rest of your styles remain exactly the same
    clockWrapper: {
      display: 'flex',
      alignItems: 'flex-end',
      // gap: '1.5vw',
    },
    unitContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    hexRow: {
      display: 'flex',
      marginBottom: '0.8vh',
      gap: '-2vw',
    },
    digitRow: {
      display: 'flex',
    },
    digitBox: {
      width: '13vw',
      height: '5vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'ClockFont_26_06_15, monospace',
      fontSize: '8vw',
      userSelect: 'none',
    },
    digitBoxSmall: {
      width: '7vw',
      height: '11vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Pliant', monospace",
      fontSize: '12vw',
      userSelect: 'none',
    },
    baseIndicator: {
      fontSize: '5vw',
      fontFamily: "'Pliant', monospace",
      alignSelf: 'flex-end',
      marginBottom: '-2vw',
    },
    unitLabel: {
      fontSize: '3vw',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: '0.25em',
      marginTop: '1.5vh',
      marginBottom: '4vh',
    }
  };

  const DigitBox: React.FC<{ char: string; isSmall?: boolean }> = ({ char, isSmall }) => (
    <div style={isSmall ? styles.digitBoxSmall : styles.digitBox}>{char}</div>
  );

  return (
    <main style={styles.container}>
      <time dateTime={time.toISOString()} style={styles.clockWrapper}>
        <div style={styles.unitContainer}>
          <div style={styles.hexRow}>
            <DigitBox char={timeParts.h.hex[0]} isSmall />
            <DigitBox char={timeParts.h.hex[1]} isSmall />
            <span style={styles.baseIndicator}>16</span>
          </div>
              <span style={styles.unitLabel}>Hours</span>
      
          <div style={styles.digitRow}>
            <DigitBox char={timeParts.h.dec[0]} />
            <DigitBox char={timeParts.h.dec[1]} />
          </div>
        </div>

        <div style={styles.unitContainer}>
          <div style={styles.hexRow}>
            <DigitBox char={timeParts.m.hex[0]} isSmall />
            <DigitBox char={timeParts.m.hex[1]} isSmall />
            <span style={styles.baseIndicator}>16</span>
          </div>
                    <span style={styles.unitLabel}>Minutes</span>
          <div style={styles.digitRow}>
            <DigitBox char={timeParts.m.dec[0]} />
            <DigitBox char={timeParts.m.dec[1]} />
          </div>

        </div>

        <div style={styles.unitContainer}>
          <div style={styles.hexRow}>
            <DigitBox char={timeParts.s.hex[0]} isSmall />
            <DigitBox char={timeParts.s.hex[1]} isSmall />
            <span style={styles.baseIndicator}>16</span>
          </div>
            <span style={styles.unitLabel}>Seconds</span>
  
          <div style={styles.digitRow}>
            <DigitBox char={timeParts.s.dec[0]} />
            <DigitBox char={timeParts.s.dec[1]} />
          </div>
              </div>
      </time>
    </main>
  );
};

export default Clock;