import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';
import backgroundTile from '@/assets/images/26_images/26-11/26-11-07/wind.webp';
import backgroundBg from '@/assets/images/26_images/26-11/26-11-07/bg.webp';
import clockFont from '@/assets/fonts/26fonts/26-11-07.ttf?url';

export const assets = [backgroundTile, backgroundBg, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_07',
  fontUrl: clockFont,
};

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="goldOrnament" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff0a5" />
          <stop offset="25%" stopColor="#d6ad51" />
          <stop offset="55%" stopColor="#76501c" />
          <stop offset="78%" stopColor="#e9c875" />
          <stop offset="100%" stopColor="#674313" />
        </linearGradient>
      </defs>
      <g fill="url(#goldOrnament)" stroke="#4b3212" strokeWidth="1.2">
        <path d="M8 8 C35 5 55 18 58 43 C60 62 43 76 25 69 C10 63 13 45 25 43 C35 41 42 51 36 57 C52 60 61 46 52 32 C44 18 26 13 8 17 Z" />
        <path d="M8 8 C5 35 18 55 43 58 C62 60 76 43 69 25 C63 10 45 13 43 25 C41 35 51 42 57 36 C60 52 46 61 32 52 C18 44 13 26 17 8 Z" />
        <path d="M58 43 C77 34 94 42 96 58 C98 72 85 83 73 76 C64 71 68 59 77 59 C83 59 86 65 82 69 C96 68 101 54 91 45 C82 36 69 37 58 43 Z" />
        <path d="M43 58 C34 77 42 94 58 96 C72 98 83 85 76 73 C71 64 59 68 59 77 C59 83 65 86 69 82 C68 96 54 101 45 91 C36 82 37 69 43 58 Z" />
        <circle cx="59" cy="59" r="7" />
      </g>
    </svg>
  );
}

export function Clock() {
  const time = useClock();
  useSuspenseFontLoader([fontConfig]);
  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const timeString = `${hours12}:${minutes} ${ampm}`;

  return (
    <main
      className={styles.container}
      style={{ '--bg-image': `url(${backgroundBg})` } as React.CSSProperties}
    >
      <SRTime time={time} />
      <div className={styles.frame}>
        <div className={styles.outerMoulding} />
        <div className={styles.goldTexture} />
        <div className={styles.innerLip} />
        <div className={styles.mat} />
        <img className={styles.centerImage} src={backgroundTile} alt="" />
        <div className={styles.digitalClock}>{timeString}</div>
        <div className={styles.sightEdge} />
        <CornerOrnament className={`${styles.ornament} ${styles.topLeft}`} />
        <CornerOrnament className={`${styles.ornament} ${styles.topRight}`} />
        <CornerOrnament className={`${styles.ornament} ${styles.bottomLeft}`} />
        <CornerOrnament
          className={`${styles.ornament} ${styles.bottomRight}`}
        />
        <div className={styles.topCartouche} />
        <div className={styles.bottomCartouche} />
        <div className={styles.topBand} />
        <div className={styles.bottomBand} />
        <div className={styles.leftBand} />
        <div className={styles.rightBand} />
      </div>
    </main>
  );
}

Clock.displayName = 'Clock_26_11_07';
export default Clock;
