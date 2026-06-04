import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Thumbnail from '../components/Thumbnail';
import { DataContext } from '../context/DataContext';
import sortStyles from '../styles/SortControls.module.css';
import styles from '../styles/Tagger.module.css';
import type { DataContextType } from '../types/data';
import { normalizeTags, sortTags } from '../utils/tagUtils';

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
      <div className={styles.card} style={{ maxWidth: '1200px' }}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Tag by Image</h1>
          <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>Back</button>
        </div>

        <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, padding: '1rem 0', borderBottom: '1px solid #eee', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div className={styles.label}>1. Set active tag</div>
              <input 
                className={styles.input}
                placeholder="e.g. 'neon', 'analog'..."
                value={activeTag}
                onChange={(e) => setActiveTag(e.target.value)}
                style={{ margin: 0, border: '2px solid #007bff' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div className={styles.label}>2. Filter/Search</div>
              <input 
                className={styles.input}
                placeholder="Search clocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ margin: 0 }}
              />
            </div>

            <div className={sortStyles.sortContainer} style={{ margin: 0 }}>
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
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              Clicking an image below will add <strong>"{activeTag}"</strong> to that clock.
            </div>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '1rem', 
          maxHeight: '60vh', 
          overflowY: 'auto',
          padding: '10px'
        }}>
          {sortedItems.map(item => (
            <div 
              key={item.date} 
              onClick={() => handleImageClick(item.date)}
              style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.1s' }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Thumbnail date={item.date} title={item.title} style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              <div style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
              <div style={{ fontSize: '0.6rem', color: '#888' }}>{item.date}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '4px', justifyContent: 'center' }}>
                {normalizeTags(localTags[item.date] ?? '').map(t => (
                  <span key={t} style={{ fontSize: '8px', padding: '1px 3px', backgroundColor: t === activeTag.toLowerCase() ? '#e7f3ff' : '#f0f0f0', borderRadius: '2px', border: t === activeTag.toLowerCase() ? '1px solid #007bff' : '1px solid #ddd' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Generated JSON</h2>
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
            className={styles.textarea} 
            style={{ height: '150px' }}
          />
        </div>
      </div>
    </div>
  );
}