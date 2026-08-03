import React from 'react';
import styles from './shapes.module.css';

interface SphereProps {
  value: string;
  label: string;
}

const Sphere: React.FC<SphereProps> = ({ value, label }) => (
  <div className={styles.scene}>
    <div className={styles.sphere}>
      <div className={styles.sphereFace}>{value}</div>
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);

export default Sphere;