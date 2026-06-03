import fontUrl from '@/assets/fonts/26fonts/26-05-03-dolphin.ttf?url';
import jumpVideo from '@/assets/images/26_images/26-06/26-06-01/sew.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import { memo, useMemo } from 'react';
import styles from './Clock.module.css'; // Import CSS module

const FONT_FAMILY = 'ClockFont_26_05_26';

const CLOCK_CONFIG = {
  COLORS: {
    background: '#000000',
    primary: '#E77912DB',
    shadow: 'drop-shadow(2px 2px 0px rgba(250, 249, 249, 0.8))',
  },
};

const HAND_DIMENSIONS = {
  hour: { width: '1.2vmin', height: '20vmin', zIndex: 3 },
  minute: { width: '0.8vmin', height: '32vmin', zIndex: 4 },
  second: { width: '0.4vmin', height: '38vmin', zIndex: 5 },
};

const BackgroundLayers = memo(() => (
  <video
    className={styles.backgroundVideo} // Use CSS module class
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={jumpVideo} type="video/mp4" />
  </video>
));

const ClockHand = ({ type, rotation }) => {
  const { width, height, zIndex } = HAND_DIMENSIONS[type];

  return (
    <div
      className={`${styles.clockHand} ${styles[`${type}Hand`]}`} // Use CSS module class and type-specific class
      style={{ // Keep dynamic styles and hand-specific dimensions inline
        width,
        height,
        zIndex,
        transform: `translate(-50%, 0) rotate(${rotation}deg)`,
      }}
    />
  );
};

const AnalogClock = () => {
  const currentTime = useClockTime();

  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: FONT_FAMILY, fontUrl }],
    []
  );
  useSuspenseFontLoader(fontConfigs);

  const { hr, min, sec } = useMemo(() => {
    const s = currentTime.getSeconds();
    const m = currentTime.getMinutes() + s / 60;
    const h = (currentTime.getHours() % 12) + m / 60;
    return { hr: h, min: m, sec: s };
  }, [currentTime]);

  return (
    <div
      className={styles.container} // Use CSS module class
      style={{
        // Define CSS variables for colors here, to be used by the CSS module
        '--clock-background-color': CLOCK_CONFIG.COLORS.background,
        '--clock-primary-color': CLOCK_CONFIG.COLORS.primary,
        '--clock-shadow-filter': CLOCK_CONFIG.COLORS.shadow,
      } as React.CSSProperties} // Type assertion for CSS variables
    >
      <BackgroundLayers />

      <div className={styles.clockFace} style={{ fontFamily: `${FONT_FAMILY}, serif` }}>
        <ClockHand type="hour" rotation={hr * 30} />
        <ClockHand type="minute" rotation={min * 6} />
        <ClockHand type="second" rotation={sec * 6} />
      </div>
    </div>
  );
};

export default AnalogClock;
