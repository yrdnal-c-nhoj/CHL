import React, { useState, useContext, useEffect, useMemo, FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import MonthDropdown from './components/MonthDropdown';
import { useNavigationState } from './hooks/useNavigationState';
import styles from './styles/Home.module.css';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';
import fbookImg from '@/assets/icons/fbook.png';
import { isValidDate, formatDateStandard as formatDate } from './utils/dateUtils';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
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
    restoreCursorPosition, 
    clearNavigationState 
  } = useNavigationState();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(() => {
    // Initialize expanded month from URL parameter or saved state
    const monthParam = searchParams.get('month');
    const savedState = restoreNavigationState();
    return monthParam || savedState?.expandedMonth || null;
  });

  // Safety cleanup: Ensure background is white and clock-mode is removed when Home mounts
  useEffect(() => {
    document.body.classList.remove('clock-mode');
    document.body.style.backgroundColor = '#ffffff';
  }, []);

  useEffect(() => {
    if (!fontsReady) {
      document.fonts.ready.then(() => {
        sessionStorage.setItem('fontsLoaded', 'true');
        setFontsReady(true);
      });
    }
  }, [fontsReady, setFontsReady]);

  // Save navigation state when leaving the home page
  useEffect(() => {
    return () => {
      // Capture current scroll position and expansion state before unmounting
      saveNavigationState(expandedMonth || undefined);
    };
  }, [expandedMonth, saveNavigationState]);

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
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    const monthIndex = parseInt(mm || '0', 10) - 1;
    const year = String(yy || '0');
    return `${monthNames[monthIndex]}   '${year}`;
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
      <div className={styles.loadingContainer}></div>
    );
  }

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div
      className={styles.homeContainer}
      style={{ opacity: fontsReady ? 1 : 0, transition: 'opacity 0.4s ease-in' }}
    >
      <TopNav />
      <div className={styles.homeCenteredContent}>
        <div className={styles.monthList}>
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
