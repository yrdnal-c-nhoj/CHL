import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-10/callisto.webm';
import overlayImage from '@/assets/images/26_images/26-09/26-09-10/deer.webp';
import overlayImage2 from '@/assets/images/26_images/26-09/26-09-10/bear.webp';
import fontUrl from '@/assets/fonts/26fonts/26-09-10.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

export const assets = [
  backgroundVideo,
  overlayImage,
  overlayImage2,
  fontUrl,
];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_09_10',
    fontUrl,
  },
];

const ROMAN = ['xii', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi'];

const AnalogClock = ({ time }: { time: Date }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div className={styles.analogClock}>
<svg
  viewBox="0 0 200 200"
  width="100%"
  height="100%"
  className={styles.svg}
  style={{ overflow: 'visible' }}
      >
        <svg
  viewBox="0 0 200 200"
  width="100%"
  height="100%"
  className={styles.svg}
  style={{ overflow: 'visible' }}
>
  <defs>
    <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="1" dy="1" stdDeviation="0" floodColor="rgba(0,0,0,0.85)" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="0" floodColor="rgba(255,255,255,0.5)" />
    </filter>
          </defs>
          
        {/* Roman numerals */}
      {ROMAN.map((num, i) => {
  const angle = i * 30;
  const rad = ((angle - 90) * Math.PI) / 180;
  const r = 100; // sits exactly on the circle's edge
  const x = 100 + Math.cos(rad) * r;
  const y = 100 + Math.sin(rad) * r;

        return (
    
          
  <text
  key={num}
  x={x}
  y={y}
  textAnchor="middle"
  dominantBaseline="middle"
  fill="rgba(198, 117, 31, 0.92)"
  fontSize={24}
  fontFamily="ClockFont_26_09_10"
  letterSpacing="0.5"
  transform={`rotate(${angle} ${x} ${y})`}
  style={{
    userSelect: 'none',
    textShadow: '1px 1px 0 rgba(0, 0, 0, 0.85), -1px -1px 0 rgba(255, 255, 255, 0.5)',
  }}
>
  {num}
</text>

  );
})}

          {/* Hands */}
  <line
    x1="100" y1="100" x2="100" y2="65"
    stroke="rgba(198, 117, 31, 0.92)"
    strokeWidth="3"
    strokeLinecap="round"
    transform={`rotate(${hourDeg} 100 100)`}
    filter="url(#handShadow)"
  />
  <line
    x1="100" y1="100" x2="100" y2="38"
    stroke="rgba(198, 117, 31, 0.92)"
    strokeWidth="2"
    strokeLinecap="round"
    transform={`rotate(${minuteDeg} 100 100)`}
    filter="url(#handShadow)"
  />
  <line
    x1="100" y1="110" x2="100" y2="28"
    stroke="rgba(198, 117, 31, 0.92)"
    strokeWidth="1.5"
    strokeLinecap="round"
    transform={`rotate(${secondDeg} 100 100)`}
    filter="url(#handShadow)"
  />

  {/* Center cap */}
  <circle cx="100" cy="100" r="1" fill="rgba(198, 117, 31, 0.92)" filter="url(#handShadow)" />
  <circle cx="100" cy="100" r="2.5" fill="rgba(198, 117, 31, 0.92)" filter="url(#handShadow)" />
</svg>

        {/* Hands */}
        <line x1="100" y1="100" x2="100" y2="65" stroke="rgba(198, 117, 31, 0.92)" strokeWidth="3" strokeLinecap="round" transform={`rotate(${hourDeg} 100 100)`} />
        <line x1="100" y1="100" x2="100" y2="38" stroke="rgba(198, 117, 31, 0.92)" strokeWidth="2" strokeLinecap="round" transform={`rotate(${minuteDeg} 100 100)`} />
        <line x1="100" y1="110" x2="100" y2="28" stroke="rgba(198, 117, 31, 0.92)" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${secondDeg} 100 100)`} />

        {/* Center cap */}
        <circle cx="100" cy="100" r="1" fill="rgba(198, 117, 31, 0.92)" />
        <circle cx="100" cy="100" r="2.5" fill="rgba(198, 117, 31, 0.92)" />
      </svg>
    </div>
  );
};

const Clock_26_09_10 = () => {
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
      <img className={styles.deer} src={overlayImage} alt="" aria-hidden="true" />
      <img className={styles.ursa} src={overlayImage2} alt="" aria-hidden="true" />
      <AnalogClock time={time} />
    </main>
  );
};

Clock_26_09_10.displayName = 'Clock_26_09_10';

export default Clock_26_09_10;
