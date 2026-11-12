import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import whitebullVideo from '@/assets/images/26_images/26-11/26-11-13/whitebull.mp4';
import europaImage from '@/assets/images/26_images/26-11/26-11-13/europa.webp';
import frameImage from '@/assets/images/26_images/26-11/26-11-13/frame.webp';

import styles from './Clock.module.css';

export const assets = [whitebullVideo, europaImage, frameImage];

const Clock_26_11_13 = () => {
  const time = useSmoothClock(50);
  const ms = time.getMilliseconds();
  const s = time.getSeconds() + ms / 1000;
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const hourAngle = h * 30 - 90;
  const minuteAngle = m * 6 - 90;
  const secondAngle = s * 6 - 90;

  return (
    <main className={styles.container}>
      <video
        src={whitebullVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <div
        className={styles.europaLayer}
        style={
          { '--europa-image': `url(${europaImage})` } as React.CSSProperties
        }
        aria-hidden="true"
      />
      <img
        src={frameImage}
        alt=""
        aria-hidden="true"
        className={styles.frameLayer}
      />
      <SRTime time={time} />
      <div
        className={styles.clock}
        aria-hidden="true"
        role="img"
        aria-label={time.toLocaleTimeString()}
      >
        <svg className={styles.svg} viewBox="0 0 400 400">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#aaaaaa" />
            </linearGradient>
            <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="60%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <radialGradient id="pinGradient" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cccccc" />
              <stop offset="100%" stopColor="#888888" />
            </radialGradient>
          </defs>

          {/* Outer ring */}
          <circle
            className={styles.outerRing}
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="url(#faceGradient)"
            strokeWidth="3"
          />

          {/* Hour markers - dots at 12 positions */}
          {[...Array(12)].map((_, i) => (
            <circle
              key={i}
              className={styles.hourMarker}
              cx="200"
              cy="200"
              r="165"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="0, 31.4"
              strokeDashoffset={-i * 31.4}
              transform={`rotate(${i * 30}, 200, 200)`}
            />
          ))}

          {/* Minute markers - tiny dots */}
          {[...Array(60)].map(
            (_, i) =>
              i % 5 !== 0 && (
                <circle
                  key={i}
                  className={styles.minuteMarker}
                  cx="200"
                  cy="200"
                  r="1"
                  fill="#ffffff"
                  transform={`rotate(${i * 6}, 200, 200)`}
                  opacity="0.3"
                />
              ),
          )}

          {/* Hour hand */}
          <line
            className={styles.hourHand}
            x1="200"
            y1="200"
            x2="200"
            y2="110"
            stroke="url(#handGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            transform={`rotate(${hourAngle}, 200, 200)`}
            filter="url(#glow)"
          />

          {/* Minute hand */}
          <line
            className={styles.minuteHand}
            x1="200"
            y1="200"
            x2="200"
            y2="75"
            stroke="url(#handGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle}, 200, 200)`}
            filter="url(#glow)"
          />

          {/* Second hand */}
          <line
            className={styles.secondHand}
            x1="200"
            y1="220"
            x2="200"
            y2="55"
            stroke="#e03030"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${secondAngle}, 200, 200)`}
          />

          {/* Center pin */}
          <circle
            className={styles.centerPin}
            cx="200"
            cy="200"
            r="10"
            fill="url(#pinGradient)"
          />

          {/* Center pin inner highlight */}
          <circle
            className={styles.centerPinInner}
            cx="195"
            cy="195"
            r="3"
            fill="#ffffff"
            opacity="0.6"
          />
        </svg>
      </div>
    </main>
  );
};

Clock_26_11_13.displayName = 'Clock_26_11_13';

export default Clock_26_11_13;
