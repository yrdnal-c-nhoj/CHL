import { useClock } from '@/utils/hooks';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-10/callisto.webm';
import overlayImage from '@/assets/images/26_images/26-09/26-09-10/deer.webp';
import overlayImage2 from '@/assets/images/26_images/26-09/26-09-10/bear.webp';

export const assets = [
  backgroundVideo,
  overlayImage,
  overlayImage2,
];

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const AnalogClock = ({ time }: { time: Date }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(70vw, 70vh)',
        height: 'min(70vw, 70vh)',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 0 12px rgba(180, 220, 255, 0.35))' }}
      >
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          stroke="rgba(200, 230, 255, 0.25)"
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="rgba(2, 6, 13, 0.35)"
          stroke="rgba(180, 220, 255, 0.45)"
          strokeWidth="2"
        />

        {/* Roman numerals – rotated to follow the perimeter */}
        {ROMAN.map((num, i) => {
          const angle = i * 30; // 0° = XII (top)
          const rad = ((angle - 90) * Math.PI) / 180;
          const r = 72; // distance from center
          const x = 100 + Math.cos(rad) * r;
          const y = 100 + Math.sin(rad) * r;

          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(200, 230, 255, 0.92)"
              fontSize={i % 3 === 0 ? 11 : 9.5}
              fontFamily="serif"
              fontWeight="500"
              letterSpacing="0.5"
              transform={`rotate(${angle} ${x} ${y})`}
              style={{ userSelect: 'none' }}
            >
              {num}
            </text>
          );
        })}

        {/* Hour hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="55"
          stroke="rgba(220, 240, 255, 0.95)"
          strokeWidth="4.5"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 100 100)`}
        />

        {/* Minute hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="38"
          stroke="rgba(200, 230, 255, 0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 100 100)`}
        />

        {/* Second hand */}
        <line
          x1="100"
          y1="110"
          x2="100"
          y2="28"
          stroke="rgba(140, 200, 255, 0.95)"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${secondDeg} 100 100)`}
        />

        {/* Center cap */}
        <circle cx="100" cy="100" r="5" fill="rgba(180, 220, 255, 0.95)" />
        <circle cx="100" cy="100" r="2.5" fill="rgba(2, 6, 13, 0.9)" />
      </svg>
    </div>
  );
};

const Clock_26_09_10 = () => {
  const time = useClock();

  const styles = {
    container: {
      position: 'relative' as const,
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden' as const,
      backgroundColor: '#02060d',
    },
    backgroundVideo: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      display: 'block',
      zIndex: 3,
      filter: 'saturate(1.35) contrast(0.9) brightness(1.55)',
      opacity: 0.5,
    },
    deer: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      zIndex: 2,
      opacity: 0.4,
      pointerEvents: 'none' as const,
    },
    ursa: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      zIndex: 1,
      opacity: 0.5,
      pointerEvents: 'none' as const,
    },
  };

  return (
    <main style={styles.container}>
      <video
        style={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <img style={styles.deer} src={overlayImage} alt="" aria-hidden="true" />
      <img style={styles.ursa} src={overlayImage2} alt="" aria-hidden="true" />
      <AnalogClock time={time} />
    </main>
  );
};

export default Clock_26_09_10;