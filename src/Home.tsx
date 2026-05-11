import React, { useState, useContext, useEffect, useMemo, FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import MonthDropdown from './components/MonthDropdown';
import { useNavigationState } from './hooks/useNavigationState';
import styles from './Home.module.css';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
}


const isValidDate = (str: string | undefined): boolean => {
  const parts = str?.split('-');
  if (!parts || parts.length !== 3) return false;
  const [yy, mm, dd] = parts.map(Number);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return false;
  // Assumes 20xx
  const date = new Date(2000 + yy, mm - 1, dd);
  return !isNaN(date.getTime());
};

const formatDate = (dateStr: string | undefined): string => {
  const parts = dateStr?.split('-');
  if (!parts || parts.length !== 3) return 'Unknown Date';
  const [yy, mm, dd] = parts.map(Number);
  const date = new Date(2000 + yy, mm - 1, dd);
  if (isNaN(date.getTime())) return 'Unknown Date';

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

const Home: FC = () => {
  const { items, loading, error } = useContext(DataContext) as { items: DataItem[], loading: boolean, error: string | null };
  const [searchParams] = useSearchParams();
  const [fontsReady, setFontsReady] = useState<boolean>(
    sessionStorage.getItem('fontsLoaded') === 'true',
  );
  const { restoreNavigationState, restoreScrollPosition, restoreCursorPosition, clearNavigationState } = useNavigationState();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(() => {
    // Initialize expanded month from URL parameter or saved state
    const monthParam = searchParams.get('month');
    const savedState = restoreNavigationState();
    return monthParam || savedState?.expandedMonth || null;
  });

  useEffect(() => {
    if (!fontsReady) {
      document.fonts.ready.then(() => {
        sessionStorage.setItem('fontsLoaded', 'true');
        setFontsReady(true);
      });
    }
  }, [fontsReady, setFontsReady]);

  // Restore scroll position and cursor when returning from clock page
  useEffect(() => {
    if (fontsReady && !loading) {
      const savedState = restoreNavigationState();
      if (savedState) {
        // Restore scroll position after a short delay to ensure DOM is ready
        setTimeout(() => {
          restoreScrollPosition(savedState);
        }, 300);
        
        // Restore cursor position after scroll is restored
        setTimeout(() => {
          restoreCursorPosition(savedState);
        }, 600);
        
        // Clear the navigation state after restoring
        setTimeout(() => {
          clearNavigationState();
        }, 800);
      }
    }
  }, [fontsReady, loading, restoreNavigationState, restoreScrollPosition, restoreCursorPosition, clearNavigationState]);

  const handleMonthToggle = (monthKey: string) => {
    setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
  };

  const sortedItems = useMemo<DataItem[]>(() => {
    return [...items].filter(
      (item) => item?.date && isValidDate(item.date),
    );
  }, [items]);

  const formatMonthName = (monthKey: string): string => {
    const [yy, mm] = monthKey.split('-');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(mm, 10) - 1;
    const year = 2000 + parseInt(yy, 10);
    return `${monthNames[monthIndex]} ${year}`;
  };

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, DataItem[]> = {};
    
    sortedItems.forEach(item => {
      if (item.date) {
        const [yy, mm] = item.date.split('-');
        const monthKey = `${yy}-${mm}`;
        if (!groups[monthKey]) {
          groups[monthKey] = [];
        }
        groups[monthKey].push(item);
      }
    });

    // Sort months in descending order (newest first)
    const sortedMonths = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    
    return sortedMonths.map(monthKey => ({
      monthKey,
      monthName: formatMonthName(monthKey),
      items: groups[monthKey] || []
    }));
  }, [sortedItems]);


  if (!fontsReady || loading) {
    return (
      <div
        style={{
          height: '100dvh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--lab-bg-gray)',
          fontFamily: 'sans-serif',
        }}
      ></div>
    );
  }

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto' }}>
      <TopNav />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--lab-bg-gray)',
          opacity: fontsReady ? 1 : 0,
          transition: 'opacity 0.6s ease-in',
        }}
      >
        <main style={{ flex: 1 }}>
        <div className="home-container">
          <div className="home-centered-content">
            <div className="month-list">
                {groupedByMonth.map((month) => (
                  <MonthDropdown
                    key={month.monthKey}
                    monthKey={month.monthKey}
                    monthName={month.monthName}
                    items={month.items}
                    formatDate={formatDate}
                    onToggle={handleMonthToggle}
                    isExpanded={expandedMonth === month.monthKey}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '0.1rem',
            padding: '0.1rem',
          }}
        >
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
              style={{ width: '2rem', height: '2rem' }}
            />
          </a>
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
              style={{ width: '2rem', height: '2rem' }}
            />
          </a>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
