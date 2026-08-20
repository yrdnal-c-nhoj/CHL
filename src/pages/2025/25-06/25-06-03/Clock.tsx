import { memo, useEffect } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import cylFont from '@/assets/fonts/25fonts/25-06-03-cyl.ttf';
import styles from './Clock.module.css';

export const assets = [cylFont];

const fontConfigs = [
  {
    fontFamily: 'cyl',
    fontUrl: cylFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const FiligreeClock =  () => {
  useSuspenseFontLoader(fontConfigs);

  return (
    <main className={styles.container} style={{
      fontFamily: "'cyl', sans-serif",
      background: 'radial-gradient(circle, rgba(163, 91, 111, 1) 0%, rgba(145, 81, 144, 1) 100%)',
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <time dateTime={new Date().toISOString()} className={styles.srOnly}>{new Date().toLocaleTimeString()}</time>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '300vw',
        width: '100vw',
        height: '100vh',
      }}>
        <div id="clockBox" className={styles.rotate} style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100vw',
          height: '100vh',
        }}>
          {[...Array(16)].map((_, i) => (
            <div key={i} className="face" style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              display: 'flex',
              gap: '1rem',
              transformStyle: 'preserve-3d',
              transform: `translate(-50%, -50%) rotateX(calc(${i + 1} * 22.5deg)) translateZ(15vw)`,
            }}>
              {[...Array(6)].map((__, j) => (
                <div key={j} className="digit" style={{
                  color: '#D0C7C7FF',
                  textShadow: '#14170EFF 0.2rem 0.2rem 0, #2C2D29FF -0.2rem -0.2rem 0',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  width: '0.3rem',
                  height: '1rem',
                  fontSize: '4.8rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <div className="face-front" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '4.8rem',
                  }}>
                    0
                  </div>
                  <div className="face-back" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    color: '#080D01FF',
                    textShadow: '#EBE7E7FF 0.3rem 0.3rem 0, #F0EEEEFF -0.3rem -0.3rem 0',
                    backgroundColor: 'rgba(27, 5, 117, 0.2)',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '4.8rem',
                  }}>
                    0
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

const MemoizedFiligreeClock = memo(FiligreeClock);
MemoizedFiligreeClock.displayName = 'Clock_25_06_03';
export default MemoizedFiligreeClock;
