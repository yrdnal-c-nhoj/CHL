import React from 'react';
import styles from './SRTime.module.css';

interface SRTimeProps {
  time: Date;
}

/**
 * A shared, accessible component that renders a semantically correct `<time>`
 * element that is visually hidden but available to screen readers.
 *
 * This centralizes the `srOnly` pattern for all clocks.
 */
const SRTime: React.FC<SRTimeProps> = ({ time }) => {
  return (
    <time dateTime={time.toISOString()} className={styles.srOnly}>
      {time.toLocaleTimeString()}
    </time>
  );
};

export default SRTime;