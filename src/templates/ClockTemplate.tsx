import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '../utils/fontLoader';
import { useClockTime, formatTime } from '../utils/clockUtils';
import type { FontConfig } from '../types/clock';
import styles from './Clock.module.css';

/* =========================
   CONFIGURATION
========================= */

const UPDATE_INTERVAL = 1000; // Update frequency in ms

/* =========================
   ASSETS (Update paths as needed)
========================= */

// Uncomment and update paths for your assets
// import backgroundImage from '../../../assets/images/your-folder/your-image.webp';
// import customFont from '../../../assets/fonts/your-font.ttf';

/* =========================
   UTILITY FUNCTIONS
========================= */

const getTimeDigits = (date) => {
  const { hours, minutes, seconds } = formatTime(date, '24h');
  return { 
    h: hours.split(''), 
    m: minutes.split(''), 
    s: seconds.split('') 
  };
};

/* =========================
   MAIN COMPONENT
========================= */

const ClockTemplate: React.FC = () => {
  const time = useClockTime();

  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      // { fontFamily: 'YourClockFont', fontUrl: customFontUrl },
    ],
    [],
  );

  // Suspend rendering until fonts are ready to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  const { h, m, s } = useMemo(
    () => getTimeDigits(time),
    [time],
  );

  return (
    <main className={styles.container}>
      {/* Semantic time for accessibility and SEO */}
      <time dateTime={time.toISOString()} className={styles.clockWrapper}>
        <span className={styles.digit}>{h[0]}</span>
        <span className={styles.digit}>{h[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{m[0]}</span>
        <span className={styles.digit}>{m[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{s[0]}</span>
        <span className={styles.digit}>{s[1]}</span>
      </time>
    </main>
  );
};

export default ClockTemplate;

/* =========================
   USAGE NOTES
========================= */

/*
This template includes best practices observed from the project:

1. **React Structure**: Uses functional components with hooks
2. **Performance**: 
   - useMemo for expensive calculations
   - Proper cleanup in useEffect
   - Optimized update intervals

3. **Asset Loading**:
   - Font loading with fallbacks (useSuspenseFontLoader is recommended)
   - Image preloading
   - Loading states with smooth transitions

4. **Responsive Design**:
   - Uses clamp() for fluid typography
   - viewport units (vw, vh, dvh)
   - Mobile-friendly scaling

5. **Error Handling**:
   - Graceful degradation
   - Console warnings for debugging

6. **Code Organization**:
   - Clear section comments
   - Separated utilities and hooks
   - Configurable constants

To customize:
1. Update asset import paths
2. Add font objects to the `fonts` array.
3. Modify colors and styles in the style objects.
4. Adjust timing and animation parameters.

Example with assets:
import myCoolFont from '../../../assets/fonts/26-01-01-cool.otf';

const fontConfigs = useMemo(() => [
  { fontFamily: 'MyClockFont', fontUrl: myCoolFont }
], []);
useSuspenseFontLoader(fontConfigs);

// In clockContainerStyle:
// fontFamily: "'MyClockFont', sans-serif",
*/
