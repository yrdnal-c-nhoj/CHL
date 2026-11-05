import { useMemo, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import styles from '../styles/TagList.module.css';
import TopNav from './TopNav';
import type { ClockItem } from '../types/data';
import Thumbnail from './Thumbnail';
import Footer from './Footer';

const TagList: FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const { items, loading, error } = useDataContext();

  const filteredItems = useMemo<ClockItem[]>(() => {
    if (!tag) return [];
    return items.filter((item) => item.tags?.includes(tag));
  }, [items, tag]);

  const title = useMemo(() => {
    if (loading) return `Loading tag: ${tag}...`;
    if (error) return 'Error loading clocks';
    const count = filteredItems.length;
    const clockWord = count === 1 ? 'clock' : 'clocks';
    return `${count} ${clockWord} matching "${tag}"`;
  }, [tag, loading, error, filteredItems.length]);

  const formatMonthName = (monthKey: string): string => {
    const [yy, mm] = (monthKey || '').split('-');
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const monthIndex = parseInt(mm || '0', 10) - 1;
    const year = String(yy || '0');
    return `${monthNames[monthIndex]}'${year}`;
  };

  const formatDate = (date: string): string => {
    const [yy, mm, dd] = date.split('-');
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const monthName = monthNames[parseInt(mm || '0', 10) - 1] || '???';
    return `${dd} ${monthName} '${yy}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <TopNav />
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.loading}>Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <TopNav />
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.error}>Error loading clocks</div>
        <Footer />
      </div>
    );
  }

  // Sort: newest first
  const sortedItems = [...filteredItems].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className={styles.container}>
      <TopNav />
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.grid}>
        {sortedItems.map((item) => (
          <a
            key={item.date}
            href={`/${item.date}`}
            className={styles.item}
            role="button"
            tabIndex={0}
          >
            <div className={styles.itemImage}>
              <Thumbnail date={item.date} title={item.title || ''} />
            </div>
            <div className={styles.itemInfo}>
              <span>{formatDate(item.date)}</span>
              <span>#{item.clockNumber ?? ''}</span>
            </div>
            <div className={styles.itemTitle}>{item.title || 'No Title'}</div>
            <div className={styles.tagsWrapper}>
              {(item.tags || [])
                .sort((a, b) => a.localeCompare(b))
                .map((t) => (
                  <a
                    key={t}
                    href={`/tag/${t}`}
                    className="tag-bubble"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t}
                  </a>
                ))}
            </div>
          </a>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default TagList;
