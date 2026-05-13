import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/TopNav.module.css';

const TopNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.topnavContainer}>
      <button
        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={styles.topnavbgcolor}>
        <div className={styles.topnavchl}>
          Cubist Heart Laboratories
        </div>
        <div className={styles.topnavbt}>
          BorrowedTime
        </div>
        <div className={styles.topnavtag}>
            a new clock every day, made from recycled internet stuff
        </div>
      </div>

      <nav className={styles.navbar}>
        <ul className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
          <li className={styles.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </NavLink>
          </li>

          {/* 
          <li className={styles.navItem}>
            <NavLink
              to="/manifesto"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              MANIFESTO
            </NavLink>
          </li>
           */}

            <li className={styles.navItem}>
            <NavLink
              to="/list"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              LIST
            </NavLink>
          </li>
        

          <li className={styles.navItem}>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to="/today"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setIsMenuOpen(false)}
            >
              TODAY
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;
