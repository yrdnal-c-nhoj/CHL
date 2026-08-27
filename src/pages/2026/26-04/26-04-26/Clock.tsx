import { memo, useMemo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgVideo from '@/assets/images/26_images/26-04/26-04-26/jetson.mp4';
import jetFont from '@/assets/fonts/26fonts/26-04-26-jet.ttf?url';
import styles from './Clock.module.css';

export const assets = [bgVideo, jetFont];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Jet',
    fontUrl: jetFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const Clock =  () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { displayHours, displayMinutes, displaySeconds, ampm } = useMemo(() => {
    const rawHours = time.getHours();
    const ampm = rawHours >= 12 ? 'PM' : 'AM';
    const h = rawHours % 12 || 12;
    return {
      displayHours: formatTime(h),
      displayMinutes: formatTime(time.getMinutes()),
      displaySeconds: formatTime(time.getSeconds()),
      ampm,
    };
  }, [time]);

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  };

  const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  };

  const baseDigitStyle = {
    fontSize: 'clamp(2rem, 8vw, 6rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const timeStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'Jet',
  };

  const digitStyle = {
    ...baseDigitStyle,
    textShadow: `
      0 0 10px rgba(255, 100, 50, 0.8),
      0 0 20px rgba(255, 100, 50, 0.6),
      0 0 40px rgba(255, 50, 100, 0.4),
      2px 2px 0px rgba(0, 0, 0, 0.8),
      -1px -1px 0px #fff
    `,
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
  };

  const separatorStyle = {
    ...digitStyle,
    margin: '0 0.25rem',
  };

  const ampmStyle = {
    ...digitStyle,
    fontSize: 'clamp(1.5rem, 6vw, 4rem)',
    marginLeft: '0.5rem',
  };

  const baseDigitBoxStyle = {
    width: 'clamp(1.5rem, 7vw, 5rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const digitBoxStyle = { ...baseDigitBoxStyle };
  const ampmBoxStyle = { ...baseDigitBoxStyle, width: 'clamp(2rem, 10vw, 6rem)', marginLeft: '0.5rem' };

  const clockWrapperStyle = {
    position: 'relative',
    zIndex: 1,
    width: '90vw',
    maxWidth: '800px',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <main className={styles.container} style={containerStyle}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <video src={bgVideo} autoPlay loop muted playsInline style={videoStyle} />
      <div style={clockWrapperStyle}>
        <time style={timeStyle} dateTime={time.toISOString()}>
          <div style={digitBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0s' }}>{displayHours[0]}</span>
          </div>
          <div style={digitBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0.1s' }}>{displayHours[1]}</span>
          </div>
          <span style={separatorStyle}>:</span>
          <div style={digitBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0.2s' }}>{displayMinutes[0]}</span>
          </div>
          <div style={digitBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0.3s' }}>{displayMinutes[1]}</span>
          </div>
          <span style={separatorStyle}>:</span>
          <div style={digitBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0.4s' }}>{displaySeconds[0]}</span>
          </div>
          <div style={digitBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0.5s' }}>{displaySeconds[1]}</span>
          </div>
          <div style={ampmBoxStyle}>
            <span className={styles.blink} style={{ animationDelay: '0.6s' }}>{ampm}</span>
          </div>
        </time>
      </div>
    </main>
  );
}

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_04_26';
export default MemoizedClock;
