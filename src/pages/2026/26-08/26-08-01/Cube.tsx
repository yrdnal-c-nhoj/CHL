import React from 'react';
import styles from './shapes.module.css';

interface CubeProps {
  value: string;
  label: string;
}

const Cube: React.FC<CubeProps> = ({ value, label }) => (
  <div className={styles.scene}>
    <div className={styles.cube}>
      <div className={`${styles.face} ${styles.front}`}>{value}</div>
      <div className={`${styles.face} ${styles.back}`}>{value}</div>
      <div className={`${styles.face} ${styles.left}`}>{value}</div>
      <div className={`${styles.face} ${styles.right}`}>{value}</div>
      <div className={`${styles.face} ${styles.top}`}>{value}</div>
      <div className={`${styles.face} ${styles.bottom}`}>{value}</div>
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

export default Cube;