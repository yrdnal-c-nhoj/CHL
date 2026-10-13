import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo, type CSSProperties } from 'react';

import limeVideo from '@/assets/images/26_images/26-10/26-10-08/merry.webm?url';
import font from '@/assets/fonts/26fonts/26-10-08.ttf?url';

import styles from './Clock.module.css';

export const assets = [limeVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_22',
  fontUrl: font,
};

const SLIDE_DURATION = 10;

type Angles = {
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
};

/* ---------- Ornate Wrought-Iron Filigree Hands (late 1800s) ---------- */

const HourHand = () => (
  <svg
    className={`${styles.hand} ${styles.hourHand}`}
    viewBox="0 0 120 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main tapered bar with twisted look */}
    <path
      className={styles.filigree}
      d="M58 195 
         C55 180 52 160 54 140 
         C56 120 50 100 55 80 
         C58 65 52 50 58 35 
         C60 25 57 15 60 5
         L62 5
         C65 15 62 25 64 35
         C70 50 64 65 67 80
         C72 100 66 120 68 140
         C70 160 67 180 64 195 Z"
    />
    {/* Large lower scrolls */}
    <path
      className={styles.filigree}
      d="M40 170 C25 155 20 140 35 130 C50 120 55 140 48 155 C45 165 42 168 40 170Z"
    />
    <path
      className={styles.filigree}
      d="M80 170 C95 155 100 140 85 130 C70 120 65 140 72 155 C75 165 78 168 80 170Z"
    />
    {/* Mid leaf clusters */}
    <path
      className={styles.filigree}
      d="M45 110 C30 95 28 80 42 75 C55 70 58 90 52 100 C49 108 47 110 45 110Z"
    />
    <path
      className={styles.filigree}
      d="M75 110 C90 95 92 80 78 75 C65 70 62 90 68 100 C71 108 73 110 75 110Z"
    />
    {/* Upper flourishes */}
    <path
      className={styles.filigree}
      d="M48 55 C35 40 38 25 50 22 C60 20 62 35 58 45 C55 52 50 55 48 55Z"
    />
    <path
      className={styles.filigree}
      d="M72 55 C85 40 82 25 70 22 C60 20 58 35 62 45 C65 52 70 55 72 55Z"
    />
    {/* Ornate tip */}
    <path
      className={styles.filigree}
      d="M50 18 C45 8 50 0 60 0 C70 0 75 8 70 18 C68 22 62 20 60 12 C58 20 52 22 50 18Z"
    />
    {/* Center pivot disc */}
    <circle className={styles.filigree} cx="60" cy="195" r="8" />
    <circle className={styles.pivotHole} cx="60" cy="195" r="3" />
  </svg>
);

const MinuteHand = () => (
  <svg
    className={`${styles.hand} ${styles.minuteHand}`}
    viewBox="0 0 100 280"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Long elegant spine */}
    <path
      className={styles.filigree}
      d="M47 275 
         C44 250 42 220 45 190 
         C48 160 42 130 47 100 
         C50 80 45 60 50 40 
         C52 25 48 15 52 5
         L54 5
         C58 15 54 25 56 40
         C61 60 56 80 59 100
         C64 130 58 160 61 190
         C64 220 62 250 59 275 Z"
    />
    {/* Cascading side scrolls */}
    <path
      className={styles.filigree}
      d="M30 240 C12 220 10 195 28 185 C48 175 52 205 42 225 C38 235 33 240 30 240Z"
    />
    <path
      className={styles.filigree}
      d="M70 240 C88 220 90 195 72 185 C52 175 48 205 58 225 C62 235 67 240 70 240Z"
    />
    <path
      className={styles.filigree}
      d="M32 180 C15 160 18 140 35 132 C50 125 52 150 45 165 C42 175 36 180 32 180Z"
    />
    <path
      className={styles.filigree}
      d="M68 180 C85 160 82 140 65 132 C50 125 48 150 55 165 C58 175 64 180 68 180Z"
    />
    <path
      className={styles.filigree}
      d="M35 120 C20 100 25 80 40 75 C55 70 55 95 48 110 C45 118 39 120 35 120Z"
    />
    <path
      className={styles.filigree}
      d="M65 120 C80 100 75 80 60 75 C45 70 45 95 52 110 C55 118 61 120 65 120Z"
    />
    {/* Delicate upper leaves */}
    <path
      className={styles.filigree}
      d="M40 60 C28 45 32 28 45 25 C55 22 56 40 52 50 C50 56 44 60 40 60Z"
    />
    <path
      className={styles.filigree}
      d="M60 60 C72 45 68 28 55 25 C45 22 44 40 48 50 C50 56 56 60 60 60Z"
    />
    {/* Fleur tip */}
    <path
      className={styles.filigree}
      d="M42 22 C38 10 45 0 52 0 C59 0 66 10 62 22 C60 28 55 24 52 14 C49 24 44 28 42 22Z"
    />
    <circle className={styles.filigree} cx="52" cy="275" r="7" />
    <circle className={styles.pivotHole} cx="52" cy="275" r="2.5" />
  </svg>
);

const SecondHand = () => (
  <svg
    className={`${styles.hand} ${styles.secondHand}`}
    viewBox="0 0 60 320"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fine tapered needle */}
    <path
      className={styles.filigree}
      d="M28 310 
         C27 280 26 240 28 200 
         C30 160 27 120 30 80 
         C31 55 29 35 32 12
         L33 12
         C36 35 34 55 35 80
         C38 120 35 160 37 200
         C39 240 38 280 37 310 Z"
    />
    {/* Tiny side filigree accents */}
    <path
      className={styles.filigree}
      d="M20 250 C10 240 12 225 22 222 C30 220 30 238 26 245 C24 250 21 250 20 250Z"
    />
    <path
      className={styles.filigree}
      d="M40 250 C50 240 48 225 38 222 C30 220 30 238 34 245 C36 250 39 250 40 250Z"
    />
    <path
      className={styles.filigree}
      d="M22 180 C12 168 15 152 25 150 C33 148 32 168 28 175 C26 180 23 180 22 180Z"
    />
    <path
      className={styles.filigree}
      d="M38 180 C48 168 45 152 35 150 C27 148 28 168 32 175 C34 180 37 180 38 180Z"
    />
    <path
      className={styles.filigree}
      d="M24 110 C15 98 18 82 28 80 C35 78 34 98 30 105 C28 110 25 110 24 110Z"
    />
    <path
      className={styles.filigree}
      d="M36 110 C45 98 42 82 32 80 C25 78 26 98 30 105 C32 110 35 110 36 110Z"
    />
    {/* Counterweight with scroll */}
    <path
      className={styles.filigree}
      d="M18 300 C5 290 8 275 22 272 C32 270 30 290 26 297 C24 302 20 300 18 300Z"
    />
    <path
      className={styles.filigree}
      d="M42 300 C55 290 52 275 38 272 C28 270 30 290 34 297 C36 302 40 300 42 300Z"
    />
    {/* Sharp ornate tip */}
    <path
      className={styles.filigree}
      d="M27 20 C24 8 30 0 33 0 C36 0 42 8 39 20 C38 25 35 22 33 12 C31 22 28 25 27 20Z"
    />
    <circle className={styles.filigree} cx="32.5" cy="310" r="5" />
    <circle className={styles.pivotHole} cx="32.5" cy="310" r="1.8" />
  </svg>
);

const ClockFace = ({ hourAngle, minuteAngle, secondAngle }: Angles) => (
  <div className={styles.clockFace}>
    {Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angle = num * 30;
      const radius = 42;

      const left = 50 + radius * Math.sin((angle * Math.PI) / 180);
      const top = 50 - radius * Math.cos((angle * Math.PI) / 180);

      return (
        <span
          key={num}
          className={styles.clockNumber}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          }}
        >
          {num}
        </span>
      );
    })}

    <div className={styles.handLayer}>
      <div
        className={styles.handWrapper}
        style={{ '--angle': `${hourAngle}deg` } as CSSProperties}
      >
        <HourHand />
      </div>

      <div
        className={styles.handWrapper}
        style={{ '--angle': `${minuteAngle}deg` } as CSSProperties}
      >
        <MinuteHand />
      </div>

      <div
        className={styles.handWrapper}
        style={{ '--angle': `${secondAngle}deg` } as CSSProperties}
      >
        <SecondHand />
      </div>
    </div>
  </div>
);

const Clock_26_09_22 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const angles = useMemo(() => {
    const milliseconds = time.getMilliseconds();
    const seconds = time.getSeconds() + milliseconds / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourAngle: hours * 30,
      minuteAngle: minutes * 6,
      secondAngle: seconds * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <video
        src={limeVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.stage}>
        <div
          className={styles.slidingClock}
          style={{ animationDelay: `-${SLIDE_DURATION / 2}s` } as CSSProperties}
        >
          <ClockFace {...angles} />
        </div>

        <div
          className={styles.slidingClock}
          style={{ animationDelay: '0s' } as CSSProperties}
        >
          <ClockFace {...angles} />
        </div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_22.displayName = 'Clock_26_09_22';

export default Clock_26_09_22;
