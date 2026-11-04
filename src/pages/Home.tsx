// Home page - flat grid of all clocks, newest first
// 3 columns always

import fbookImg from '@/assets/icons/fbook.png';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';
import type { FC } from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import TopNav from '../components/TopNav';
import { DataContext } from '../context/DataContext';
import { useNavigationState } from '../hooks/useNavigationState';
import styles from '../styles/Home.module.css';
import {
  formatDateStandard as formatDate,
  isValidDate,
} from '../utils/dateUtils';
import Thumbnail from '../components/Thumbnail';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
  tags?: string[];
}

const Home: FC = () => {
  const context = useContext(DataContext) as {
    items: DataItem[];
    loading: boolean;
    error: string | null;
  };
  const { items = [], loading = false, error = null } = context || {};
  const [searchParams] = useSearchParams();
  const [fontsReady, setFontsReady] = useState<boolean>(
    sessionStorage.getItem('fontsLoaded') === 'true',
  );
  const {
    saveNavigationState,
    restoreNavigationState,
    restoreScrollPosition,
    clearNavigationState,
  } = useNavigationState();

  useEffect(() => {
    document.body.classList.remove('clock-mode');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    if (!fontsReady) {
      document.fonts.ready.then(() => {
        sessionStorage.setItem('fontsLoaded', 'true');
        setFontsReady(true);
      });
    }
  }, [fontsReady, setFontsReady]);

  useEffect(() => {
    return () => {
      saveNavigationState(undefined);
    };
  }, [saveNavigationState]);

  useEffect(() => {
    if (fontsReady && !loading) {
      const savedState = restoreNavigationState();
      if (savedState) {
        requestAnimationFrame(() => {
          restoreScrollPosition(savedState);
        });
        setTimeout(() => {
          clearNavigationState();
        }, 400);
      }
    }
  }, [
    fontsReady,
    loading,
    restoreNavigationState,
    restoreScrollPosition,
    clearNavigationState,
  ]);

  const sortedItems = useMemo<DataItem[]>(() => {
    return [...items]
      .filter((item) => item?.date && isValidDate(item.date))
      .sort((a, b) => b.date.localeCompare(a.date)); // newest first
  }, [items]);

  if (loading || (!fontsReady && !error)) {
    return <div className={styles.loadingContainer} />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Error:{' '}
        {typeof error === 'string'
          ? error
          : (error as any).message || String(error)}
      </div>
    );
  }

  return (
    <div
      className={`${styles.homeContainer} ${fontsReady ? '' : styles.fadeOut}`}
    >
      <TopNav />
      <div className={styles.homeCenteredContent}>
        <div className={styles.calendarGrid}>
          {sortedItems.map((item) => (
            <a
              key={item.date}
              href={`/${item.date}`}
              className={styles.calendarItem}
              role="button"
              tabIndex={0}
            >
              <div className={styles.calendarItemImage}>
                <Thumbnail date={item.date} title={item.title || ''} />
              </div>
              <div className={styles.calendarItemInfo}>
                <span>{formatDate(item.date)}</span>
                <span>#{item.clockNumber ?? ''}</span>
              </div>
              <div className={styles.calendarItemTitle}>
                {item.title || 'No Title'}
              </div>
              <div className="tags-wrapper">
                {(item.tags || [])
                  .sort((a, b) => a.localeCompare(b))
                  .map((tag) => (
                    <a
                      key={tag}
                      href={`/tag/${tag}`}
                      className="tag-bubble"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tag}
                    </a>
                  ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.socialContainer}>
        <a
          href="https://x.com/cubistheartlabs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            decoding="async"
            loading="lazy"
            src={elonImg}
            alt="X"
            className={styles.footerIcon}
          />
        </a>
        <a
          href="https://www.instagram.com/cubist_heart_labs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            decoding="async"
            loading="lazy"
            src={instaImg}
            alt="Instagram"
            className={styles.footerIcon}
          />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100090369371981"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            decoding="async"
            loading="lazy"
            src={fbookImg}
            alt="Facebook"
            className={styles.footerIcon}
          />
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
