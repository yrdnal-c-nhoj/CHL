import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import circleImage from '@/assets/images/26_images/26-11/26-11-19/circl.webp';

import styles from './Clock.module.css';
import type { CSSProperties } from 'react';

export const assets = [circleImage];

const Clock_26_11_19 = () => {
  const time = useSmoothClock(50);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Smooth hand positions (including fractional parts for continuous motion)
  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30; // 30 degrees per hour
  const minuteAngle = (minutes + seconds / 60 + milliseconds / 60000) * 6; // 6 degrees per minute
  const secondAngle = (seconds + milliseconds / 1000) * 6; // 6 degrees per second

  // Organic branch/root SVG paths - each hand is a different branch shape
  // Paths are drawn pointing upward (12 o'clock), will be rotated via CSS
  const hourBranchPath =
    'M0,0 C-8,0 -15,-30 -12,-100 C-10,-140 -5,-170 0,-180 C5,-170 10,-140 12,-100 C15,-30 8,0 0,0 Z';
  const hourSubBranches = [
    'M-12,-60 C-12,-60 -35,-70 -40,-90 C-45,-110 -40,-130 -30,-135',
    'M10,-40 C10,-40 25,-45 30,-65 C35,-85 30,-105 20,-110',
    'M-5,-100 C-5,-100 -20,-105 -22,-125 C-25,-145 -18,-160 -10,-165',
  ];

  const minuteBranchPath =
    'M0,0 C-5,0 -10,-40 -8,-130 C-6,-170 -2,-200 0,-210 C2,-200 6,-170 8,-130 C10,-40 5,0 0,0 Z';
  const minuteSubBranches = [
    'M-8,-70 C-8,-70 -22,-75 -25,-95 C-28,-115 -22,-135 -15,-140',
    'M6,-50 C6,-50 18,-52 22,-72 C26,-92 20,-110 14,-115',
    'M-3,-120 C-3,-120 -12,-125 -14,-145 C-16,-165 -10,-180 -4,-185',
  ];

  const secondBranchPath =
    'M0,0 C-2,0 -4,-60 -3,-180 C-2,-220 0,-250 0,-260 C0,-250 2,-220 3,-180 C4,-60 2,0 0,0 Z';
  const secondSubBranches = [
    'M-3,-90 C-3,-90 -10,-95 -12,-115',
    'M2,-70 C2,-70 7,-72 9,-92',
  ];

  return (
    <main
      className={styles.container}
      style={{ '--background-image': `url(${circleImage})` } as CSSProperties}
    >
      <SRTime time={time} />

      <div className={styles.clockFace} aria-hidden="true">
        {/* Hour hand - thickest main branch */}
        <svg
          className={styles.handSvg}
          style={{ '--angle': `${hourAngle}deg` } as CSSProperties}
          viewBox="-50 -300 100 300"
          aria-hidden="true"
        >
          <path className={styles.branch} d={hourBranchPath} />
          {hourSubBranches.map((d, i) => (
            <path key={i} className={styles.subBranch} d={d} />
          ))}
        </svg>

        {/* Minute hand - medium branch */}
        <svg
          className={styles.handSvg}
          style={{ '--angle': `${minuteAngle}deg` } as CSSProperties}
          viewBox="-40 -350 80 350"
          aria-hidden="true"
        >
          <path className={styles.branch} d={minuteBranchPath} />
          {minuteSubBranches.map((d, i) => (
            <path key={i} className={styles.subBranch} d={d} />
          ))}
        </svg>

        {/* Second hand - thin twig */}
        <svg
          className={`${styles.handSvg} ${styles.secondHandSvg}`}
          style={{ '--angle': `${secondAngle}deg` } as CSSProperties}
          viewBox="-20 -380 40 380"
          aria-hidden="true"
        >
          <path className={styles.branch} d={secondBranchPath} />
          {secondSubBranches.map((d, i) => (
            <path key={i} className={styles.subBranch} d={d} />
          ))}
        </svg>

        {/* Center dot - tree ring */}
        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

Clock_26_11_19.displayName = 'Clock_26_11_19';

export default Clock_26_11_19;
