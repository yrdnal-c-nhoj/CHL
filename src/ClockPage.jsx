import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import styles from './ClockPage.module.css';

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);

  const formatTitle = (title) => {
    if (!title) return 'Home';
    return title.replace(/clock/i, '').trim() || 'Home';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  const currentIndex = items.findIndex(item => item.date === date);
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  const currentItem = items[currentIndex];
  const currentYear = new Date().getFullYear();

  if (loading) return <div className={styles.loading}>Loading data...</div>;

  if (error || pageError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error || pageError}</div>
        <p>
          <Link to="/" className={styles.navLink}>
            Return to {formatTitle(currentItem?.title)}
          </Link>
        </p>
        {items.length > 0 && (
          <div>
            <h2>Available Dates</h2>
            <ul className={styles.dateList}>
              {items.map(item => (
                <li key={item.date} className={styles.dateListItem}>
                  <Link to={`/${item.date}`} className={styles.navLink}>
                    <span className={styles.date}>{item.date}</span>
                    <span className={styles.title}>{formatTitle(item.title) || 'No Title'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <footer className={styles.footer}>
          © {currentYear} Cubist Heart Laboratories. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header />
        {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.navigationList}>
          {prevItem && (
            <li>
              <Link
                to={`/${prevItem.date}`}
                className={styles.navLink}
                aria-label={`Go to ${formatTitle(prevItem.title)}`}
              >
                {prevItem.date}
              </Link>
            </li>
          )}
          <li>
            <Link to="/" className={styles.navLink} aria-label="Go to Home">
              {formatTitle(currentItem?.title)}
            </Link>
          </li>
          {nextItem && (
            <li>
              <Link
                to={`/${nextItem.date}`}
                className={styles.navLink}
                aria-label={`Go to ${formatTitle(nextItem.title)}`}
              >
                {nextItem.date}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <footer className={styles.footer}>
        © {currentYear} Cubist Heart Laboratories. All rights reserved.
      </footer>
    </div>
  );
};

export default ClockPage;