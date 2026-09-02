import fontUrl from '@/assets/fonts/26fonts/26-06-15.otf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { useMemo, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [fontUrl];

const Clock =  () => {
  const time = useClock();

  const fontConfigs: FontConfig[] = useMemo(
    () => [
      {
        fontFamily: 'ClockFont_26_06_15',
        fontUrl,
      },
    ],
    []
  );

  useSuspenseFontLoader(fontConfigs);

  const timeParts = useMemo(() => {
    const toHex2 = (num: number): string => num.toString(16).toUpperCase().padStart(2, '0');
    const toDec2 = (num: number): string => num.toString().padStart(2, '0');

    return {
      h: { hex: toHex2(time.getHours()), dec: toDec2(time.getHours()) },
      m: { hex: toHex2(time.getMinutes()), dec: toDec2(time.getMinutes()) },
      s: { hex: toHex2(time.getSeconds()), dec: toDec2(time.getSeconds()) },
    };
  }, [time]);

  const inlineStyles: Record<string, React.CSSProperties> = {
    clockWrapper: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    unitContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    hexRow: {
      display: 'flex',
      marginBottom: '0.8dvh',
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
      marginTop: '1.5dvh',
      marginBottom: '4dvh',
    },
  };

  const DigitBox: React.FC<{ char: string; isSmall?: boolean }> = ({ char, isSmall }) => (
    <div style={isSmall ? inlineStyles.digitBoxSmall : inlineStyles.digitBox}>{char}</div>
  );

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <time dateTime={time.toISOString()} style={inlineStyles.clockWrapper}>
        <div style={inlineStyles.unitContainer}>
          <div style={inlineStyles.hexRow}>
            <DigitBox char={timeParts.h.hex[0]} isSmall />
            <DigitBox char={timeParts.h.hex[1]} isSmall />
            <span style={inlineStyles.baseIndicator}>16</span>
          </div>
          <span style={inlineStyles.unitLabel}>Hours</span>

          <div style={inlineStyles.digitRow}>
            <DigitBox char={timeParts.h.dec[0]} />
            <DigitBox char={timeParts.h.dec[1]} />
          </div>
        </div>

        <div style={inlineStyles.unitContainer}>
          <div style={inlineStyles.hexRow}>
            <DigitBox char={timeParts.m.hex[0]} isSmall />
            <DigitBox char={timeParts.m.hex[1]} isSmall />
            <span style={inlineStyles.baseIndicator}>16</span>
          </div>
          <span style={inlineStyles.unitLabel}>Minutes</span>
          <div style={inlineStyles.digitRow}>
            <DigitBox char={timeParts.m.dec[0]} />
            <DigitBox char={timeParts.m.dec[1]} />
          </div>

        </div>

        <div style={inlineStyles.unitContainer}>
          <div style={inlineStyles.hexRow}>
            <DigitBox char={timeParts.s.hex[0]} isSmall />
            <DigitBox char={timeParts.s.hex[1]} isSmall />
            <span style={inlineStyles.baseIndicator}>16</span>
          </div>
          <span style={inlineStyles.unitLabel}>Seconds</span>

          <div style={inlineStyles.digitRow}>
            <DigitBox char={timeParts.s.dec[0]} />
            <DigitBox char={timeParts.s.dec[1]} />
          </div>
        </div>
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_06_15';
export default MemoizedClock;
