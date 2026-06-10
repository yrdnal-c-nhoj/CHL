import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/TopNav.module.css';

const TopNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.topnavContainer}>
      <div className={styles.topnavbgcolor}>
        <div className={styles.topnavchl}>Cubist Heart Laboratories</div>
        <div className={styles.topnavbt}>BorrowedTime</div>
        <div className={styles.topnavtag}>A new clock every day</div>
      </div>

      <nav className={styles.navbar}>
        <button 
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
          <li className={styles.navItem}>
            <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`} onClick={closeMenu}>HOME</Link>

          </li>
          <li className={styles.navItem}>
            <Link to="/list" className={`${styles.navLink} ${isActive('/list') ? styles.active : ''}`} onClick={closeMenu}>List</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/tags" className={`${styles.navLink} ${isActive('/tags') ? styles.active : ''}`} onClick={closeMenu}>Tags</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/contact" className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`} onClick={closeMenu}>CONTACT</Link>

          </li>
          <li className={styles.navItem}>
            <Link to="/today" className={`${styles.navLink} ${isActive('/today') ? styles.active : ''}`} onClick={closeMenu}>TODAY</Link>


          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;

