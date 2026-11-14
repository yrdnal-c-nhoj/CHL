import React from 'react';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  visible: boolean;
}

const Header: React.FC<HeaderProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <header
      className={`${styles.titleContainer} ${visible ? styles.visible : styles.hidden}`}
    >
      <div className={styles.chlTitle}>🧊🫀🔭</div>
      <div className={styles.btTitle}>BorrowedTime</div>
    </header>
  );
};

export default Header;
