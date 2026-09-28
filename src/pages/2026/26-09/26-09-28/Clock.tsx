import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-28/lion.webm';
import overlayImage from '@/assets/images/26_images/26-09/26-09-28/sun2.webp';
import overlayImage2 from '@/assets/images/26_images/26-09/26-09-28/fire.webp';
import fontUrl from '@/assets/fonts/26fonts/26-09-28.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, overlayImage, overlayImage2, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_09_28',
    fontUrl,
  },
];

const NUMERALS = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

const AnalogClock = ({ time }: { time: Date }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div className={styles.analogClock}>
      <svg viewBox="0 0 200 200" className={styles.svg}>
        <defs>
          {/* More reliable shadow – small blur instead of stdDeviation=0 */}
          <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1.2" dy="1.2" stdDeviation="0.6" floodColor="rgba(0,0,0,0.9)" />
            <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0.4" floodColor="rgba(255,255,255,0.45)" />
          </filter>
        </defs>

        {/* Numerals */}
        {NUMERALS.map((num, i) => {
          const angle = i * 30;
          const rad = ((angle - 90) * Math.PI) / 180;
          const r = 100;
          const x = 100 + Math.cos(rad) * r;
          const y = 100 + Math.sin(rad) * r;
          return (
            <text
              key={num}
              className={styles.numeral}
              x={x}
              y={y}
              transform={`rotate(${angle} ${x} ${y})`}
            >
              {num}
            </text>
          );
        })}

        {/* Hands */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="62"
          className={`${styles.hand} ${styles.hourHand}`}
          transform={`rotate(${hourDeg} 100 100)`}
        />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="36"
          className={`${styles.hand} ${styles.minuteHand}`}
          transform={`rotate(${minuteDeg} 100 100)`}
        />
        <line
          x1="100"
          y1="108"
          x2="100"
          y2="26"
          className={`${styles.hand} ${styles.secondHand}`}
          transform={`rotate(${secondDeg} 100 100)`}
        />

     </svg>
    </div>
  );
};

const Clock_26_09_28 = () => {
  const time = useClock();
  useSuspenseFontLoader(fontConfigs);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <video
        className={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <img className={styles.ursa} src={overlayImage2} alt="" aria-hidden="true" />
      <AnalogClock time={time} />
      <div
        className={styles.deer}
        style={{ backgroundImage: `url(${overlayImage})` }}
        aria-hidden="true"
      />
    </main>
  );
};

Clock_26_09_28.displayName = 'Clock_26_09_28';
export default Clock_26_09_28;