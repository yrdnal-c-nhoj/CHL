import React from 'react';

import lionOverlay from '@/assets/images/26_images/26-08/26-08-07/lion.webp';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-07/mount.mp4?url';
import windOverlay from '@/assets/images/26_images/26-08/26-08-07/wind.webp';

import styles from './Clock.module.css';

/**
 * TODO:
 * 1. Add a font file to the assets directory.
 * 2. Import the font file below (e.g., `import clockFont from '@/assets/fonts/26fonts/26-08-06-template.ttf?url';`).
 * 3. Uncomment and update the `fontConfigs` and `assets` exports.
 */

// const fontConfigs: FontConfig[] = [
//   { fontFamily: 'TemplateClockFont', fontUrl: clockFont },
// ];

/**
 * Preload any assets required for the clock page. This can include fonts, images, etc.
 * The preloader will filter out videos if more than one asset is present.
 *
 * @example
 * export const assets: string[] = [clockFont, backgroundImage];
 */
export const assets: string[] = [backgroundVideo, lionOverlay, windOverlay];

/**
 * A full-screen layered background clock component.
 */
const TemplateClock: React.FC = () => {
  return (
    // Use <main> as the root element for semantic correctness.
    <main className={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={backgroundVideo}
        // Add a poster image to prevent a flash of black before the video loads.
        // poster="/path/to/poster-image.jpg"
      />
      <img
        src={lionOverlay}
        alt=""
        aria-hidden="true"
        className={styles.lionOverlay}
      />
      <img
        src={windOverlay}
        alt=""
        aria-hidden="true"
        className={styles.windOverlay}
      />
    </main>
  );
};

// Wrap the component in React.memo for performance optimization.
// Set a displayName for better debugging.
const MemoizedTemplateClock = React.memo(TemplateClock);
MemoizedTemplateClock.displayName = 'TemplateClock';

export default MemoizedTemplateClock;
