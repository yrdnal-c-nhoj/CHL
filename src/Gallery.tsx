import React from 'react';
import { Link } from 'react-router-dom';
import clocks from './context/clockpages.json';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>Archive</h1>
          <p className={styles.subtitle}>Daily experiments in time and motion.</p>
        </div>
        <Link to="/" className={styles.backButton}>
          Close
        </Link>
      </header>

      <div className={styles.grid}>
        {clocks.map((clock) => (
          <Link 
            key={clock.date} 
            to={`/${clock.date}`} 
            className={styles.clockCard}
          >
            <div className={styles.thumbnailWrapper}>
              <img 
                src={`/screenshots/${clock.date}.png`} 
                alt={clock.title}
                className={styles.thumbnail}
                loading="lazy"
                onError={(e) => {
                  // Fallback for missing screenshots
                  (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                }}
              />
            </div>
            <div className={styles.cardOverlay}>
              <span className={styles.dateLabel}>{clock.date}</span>
              <h2 className={styles.clockTitle}>{clock.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;