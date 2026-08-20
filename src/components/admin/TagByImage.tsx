import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import sortStyles from '../../styles/SortControls.module.css';
import styles from '../../styles/Tagger.module.css';
import type { DataContextType } from '../../types/data';
import { normalizeTags, sortTags } from '../../utils/tagUtils';
import Thumbnail from '../Thumbnail';

export default function TagByImage() {
  const navigate = useNavigate();
  const ctx = useContext(DataContext) as DataContextType | undefined;
  const items = ctx?.items ?? [];
  const loading = ctx?.loading ?? true;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sortOrder, setSortOrder] = useState<'date' | 'title'>('date');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  
  // Local state to track tag changes before export
  const [localTags, setLocalTags] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length > 0) {
      const initial: Record<string, string> = {};
      items.forEach(it => {
        initial[it.date] = (it.tags ?? []).join(', ');
      });
      setLocalTags(initial);
    }
  }, [items]);

  const sortedItems = useMemo(() => {
    const filtered = items.filter(it => 
      it.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      it.date.includes(searchTerm)
    );

    return [...filtered].sort((a, b) => {
      const valA = sortOrder === 'date' ? a.date : a.title.toLowerCase();
      const valB = sortOrder === 'date' ? b.date : b.title.toLowerCase();
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, searchTerm, sortOrder, direction]);

  const handleImageClick = (date: string) => {
    if (!activeTag.trim()) {
      alert("Please enter a tag name first!");
      return;
    }

    const currentTags = normalizeTags(localTags[date] ?? '');
    const tagToAdd = activeTag.trim().toLowerCase();

    if (!currentTags.includes(tagToAdd)) {
      const nextTags = [...currentTags, tagToAdd];
      setLocalTags(prev => ({ ...prev, [date]: nextTags.join(', ') }));
    }
  };

  const editedClockPagesJson = useMemo(() => {
    const updated = items.map((it) => {
      const tagsInput = localTags[it.date] ?? '';
      const parsedTags = sortTags(new Set(normalizeTags(tagsInput)));
      return {
        path: it.path,
        date: it.date,
        title: it.title,
        tags: parsedTags.length ? parsedTags : undefined,
      };
    });
    return JSON.stringify(updated, null, 2);
  }, [items, localTags]);

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${styles.tagByImageCard}`}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Tag by Image</h1>
          <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>Back</button>
        </div>

        <div className={styles.stickyHeader}>
          <div className={styles.stickyHeaderRow}>
            <div className={styles.stickyField}>
              <div className={styles.label}>1. Set active tag</div>
              <input
                className={`${styles.input} ${styles.activeTagInput}`}
                placeholder="e.g. 'neon', 'analog'..."
                value={activeTag}
                onChange={(e) => setActiveTag(e.target.value)}
              />
            </div>

            <div className={styles.stickyField}>
              <div className={styles.label}>2. Filter/Search</div>
              <input
                className={`${styles.input} ${styles.filterInput}`}
                placeholder="Search clocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={`${sortStyles.sortContainer} ${styles.sortRow}`}>
              <button
                className={`${sortStyles.sortButton} ${sortOrder === 'date' ? sortStyles.active : ''}`}
                onClick={() => { setSortOrder('date'); setDirection(d => d === 'asc' ? 'desc' : 'asc'); }}
              >
                Date {sortOrder === 'date' && (direction === 'asc' ? '↓' : '↑')}
              </button>
              <button
                className={`${sortStyles.sortButton} ${sortOrder === 'title' ? sortStyles.active : ''}`}
                onClick={() => { setSortOrder('title'); setDirection(d => d === 'asc' ? 'desc' : 'asc'); }}
              >
                Title {sortOrder === 'title' && (direction === 'asc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
          {activeTag && (
            <div className={styles.hint}>
              Clicking an image below will add <strong>"{activeTag}"</strong> to that clock.
            </div>
          )}
        </div>

        <div className={styles.imageGrid}>
          {sortedItems.map(item => (
            <div
              key={item.date}
              className={styles.imageCard}
              onClick={() => handleImageClick(item.date)}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Thumbnail date={item.date} title={item.title} className={styles.imageCardThumb} />
              <div className={styles.imageCardTitle}>{item.title}</div>
              <div className={styles.imageCardDate}>{item.date}</div>
              <div className={styles.tagChips}>
                {normalizeTags(localTags[item.date] ?? '').map(t => (
                  <span key={t} className={`${styles.tagChip} ${t === activeTag.toLowerCase() ? styles.tagChipActive : styles.tagChipInactive}`}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.jsonSection}>
          <div className={styles.jsonHeader}>
            <h2 className={styles.jsonHeading}>Generated JSON</h2>
            <button
              className={styles.button}
              onClick={() => {
                navigator.clipboard.writeText(editedClockPagesJson);
                alert('Copied!');
              }}
            >
              Copy to Clipboard
            </button>
          </div>
          <textarea
            readOnly
            value={editedClockPagesJson}
            className={`${styles.textarea} ${styles.jsonTextarea}`}
          />
        </div>
      </div>
    </div>
  );
}