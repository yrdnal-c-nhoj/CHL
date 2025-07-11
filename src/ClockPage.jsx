import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import styles from './ClockPage.module.css';

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [navVisible, setNavVisible] = useState(true);

  const formatTitle = (title) => {
    if (!title) return 'Home';
    return title.replace(/clock/i, '').trim() || 'Home';
  };

  // Handle body overflow cleanup
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle dynamic import of clock component
  useEffect(() => {
    if (loading) return;
    if (date && date.match(/^\d{2}-\d{2}-\d{2}$/)) {
      const item = items.find(i => i.date === date);
      if (item && item.path) {
        console.log(`Attempting to import: ./pages/${item.path}/Clock.jsx`);
        import(`./pages/${item.path}/Clock.jsx`)
          .then(module => {
            console.log(`Successfully loaded Clock.jsx for path: ${item.path}`);
            setClockComponent(() => module.default);
          })
          .catch(err => {
            console.error(`Failed to load clock for path: ${item.path}`, err);
            setPageError(`Failed to load clock for ${date}: ${err.message}`);
          });

        import(`./pages/${item.path}/styles.css`).catch(() => {});
      } else {
        setPageError(`No path found for date ${date}.`);
      }
    } else {
      setPageError('Invalid date format. Use YY-MM-DD (e.g., 25-06-01).');
    }
  }, [date, items, loading]);

  // Handle navigation fade-out and interaction events
  useEffect(() => {
    let fadeTimer = setTimeout(() => {
      setNavVisible(false);
    }, 500);

    const handleInteraction = () => {
      setNavVisible(true);
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        setNavVisible(false);
      }, 500);
    };

    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('mousemove', handleInteraction);

    return () => {
      clearTimeout(fadeTimer);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, []);

  const currentIndex = items.findIndex(item => item.date === date);
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  const currentItem = items[currentIndex];

  if (loading) return <div className={styles.loading}>Loading data...</div>;

  if (error || pageError) {
    return (

<div className={styles.container}>
  <div className={styles.content}>
    {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
  </div>

  {currentItem && (
    <div className={styles.footerStrip}>
      <div className={styles.footerLeft}>
        <span><strong>#</strong> {currentIndex + 1}</span>
      </div>
      <div className={styles.footerCenter}>
        <span><strong>Title:</strong> {formatTitle(currentItem.title)}</span>
      </div>
      <div className={styles.footerRight}>
        <span><strong>Date:</strong> {currentItem.date}</span>
      </div>
    </div>
  )}
</div>




    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
      </div>
      {prevItem && (
        <Link
          to={`/${prevItem.date}`}
          className={`${styles.floatingNav} ${styles.leftNav} ${navVisible ? styles.visible : styles.hidden}`}
          aria-label={`Go to ${formatTitle(prevItem.title)}`}
        >
          ←
        </Link>
      )}
      {nextItem && (
        <Link
          to={`/${nextItem.date}`}
          className={`${styles.floatingNav} ${styles.rightNav} ${navVisible ? styles.visible : styles.hidden}`}
          aria-label={`Go to ${formatTitle(nextItem.title)}`}
        >
          →
        </Link>
      )}




{currentItem && (
  <div className={styles.footerStrip}>
    <div className={styles.footerLeft}>
      <span><strong>#</strong> {currentIndex + 1}</span>
    </div>
    <div className={styles.footerCenter}>
      <span><strong>Title:</strong> {formatTitle(currentItem.title)}</span>
    </div>
    <div className={styles.footerRight}>
      <span><strong>Date:</strong> {currentItem.date}</span>
    </div>
  </div>
)}


    </div>
    
  );
};

export default ClockPage;