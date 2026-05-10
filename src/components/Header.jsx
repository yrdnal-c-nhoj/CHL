import React from 'react';
import styles from './Header.module.css';

export default function Header({ visible }) {
  return (
    <div className={`${styles.titleContainer} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.chlTitle}>🧊🫀🔭</div>
      <div className={styles.btTitle}>BorrowedTime</div>
    </div>
  );
}
