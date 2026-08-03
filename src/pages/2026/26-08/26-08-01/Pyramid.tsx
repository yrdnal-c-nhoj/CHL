import React from 'react';
import styles from './shapes.module.css';

interface PyramidProps {
  value: string;
  label: string;
}

const Pyramid: React.FC<PyramidProps> = ({ value, label }) => (
  <div className={styles.scene}>
    <div className={styles.pyramid}>
      <div className={`${styles.pyramidFace} ${styles.pyramidFront}`}>
        {value}
      </div>
      <div className={`${styles.pyramidFace} ${styles.pyramidRight}`}>
        {value}
      </div>
      <div className={`${styles.pyramidFace} ${styles.pyramidBack}`}>{value}</div>
      <div className={`${styles.pyramidFace} ${styles.pyramidLeft}`}>
        {value}
      </div>
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

export default Pyramid;