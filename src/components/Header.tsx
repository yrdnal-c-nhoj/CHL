import React from 'react';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  visible: boolean;
}

const Header: React.FC<HeaderProps> = ({ visible }) => {
  return (
    <div
      className={`${styles.titleContainer} ${visible ? styles.visible : styles.hidden}`}
    >
      <div className={styles.chlTitle}>🧊🫀🔭</div>
      <div className={styles.btTitle}>BorrowedTime</div>
    </div>
  );
};

export default Header;
