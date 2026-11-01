import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-31/threads.mp4';
import font from '@/assets/fonts/26fonts/26-10-20.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_31',
  fontUrl: font,
};

const CLOCK_CENTER = 100;
const CLOCK_RADIUS = 68;
const NUM_RADIUS = 78;

const Clock_26_10_31 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const hourAngle = hours * 30;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clockFace} aria-hidden="true">
        <svg viewBox="0 0 200 200" className={styles.svg}>
          {/* Numbers 1-12 positioned on circumference, rotated to align with circle */}
          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const angle = num * 30; // 30 degrees per number
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = CLOCK_CENTER + Math.cos(rad) * NUM_RADIUS;
            const y = CLOCK_CENTER + Math.sin(rad) * NUM_RADIUS;
            // Rotate number to be tangent to circle (angle + 90° = pointing outward, angle = aligned with circumference)
            const rotation = angle;
            return (
              <text
                key={num}
                x={x}
                y={y}
                className={styles.number}
                transform={`rotate(${rotation} ${x} ${y})`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {num}
              </text>
            );
          })}

          {/* Hour marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x1 = CLOCK_CENTER + Math.cos(rad) * CLOCK_RADIUS;
            const y1 = CLOCK_CENTER + Math.sin(rad) * CLOCK_RADIUS;
            const x2 = CLOCK_CENTER + Math.cos(rad) * (CLOCK_RADIUS + 6);
            const y2 = CLOCK_CENTER + Math.sin(rad) * (CLOCK_RADIUS + 6);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={styles.tick}
              />
            );
          })}

          {/* Clock face circle */}
          <circle
            cx={CLOCK_CENTER}
            cy={CLOCK_CENTER}
            r={CLOCK_RADIUS}
            className={styles.faceCircle}
          />

          {/* Center dot */}
          <circle
            cx={CLOCK_CENTER}
            cy={CLOCK_CENTER}
            r={4}
            className={styles.centerDot}
          />

          {/* Hour hand */}
          <line
            x1={CLOCK_CENTER}
            y1={CLOCK_CENTER}
            x2={CLOCK_CENTER}
            y2={CLOCK_CENTER - 35}
            className={styles.hourHand}
            transform={`rotate(${hourAngle} ${CLOCK_CENTER} ${CLOCK_CENTER})`}
          />

          {/* Minute hand */}
          <line
            x1={CLOCK_CENTER}
            y1={CLOCK_CENTER}
            x2={CLOCK_CENTER}
            y2={CLOCK_CENTER - 55}
            className={styles.minuteHand}
            transform={`rotate(${minuteAngle} ${CLOCK_CENTER} ${CLOCK_CENTER})`}
          />

          {/* Second hand */}
          <line
            x1={CLOCK_CENTER}
            y1={CLOCK_CENTER}
            x2={CLOCK_CENTER}
            y2={CLOCK_CENTER - 62}
            className={styles.secondHand}
            transform={`rotate(${secondAngle} ${CLOCK_CENTER} ${CLOCK_CENTER})`}
          />
        </svg>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_31.displayName = 'Clock_26_10_31';
export default Clock_26_10_31;
