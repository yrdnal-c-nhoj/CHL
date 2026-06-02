import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Thumbnail from '../components/Thumbnail';
import { DataContext } from '../context/DataContext';
import sortStyles from '../styles/SortControls.module.css';
import styles from '../styles/Tagger.module.css'; // Reusing Tagger styles for consistency
import type { DataContextType } from '../types/data';
import { normalizeTags, sortTags } from '../utils/tagUtils';

export default function TagManager() {
  const navigate = useNavigate();
  const ctx = useContext(DataContext) as DataContextType | undefined;
  const items = ctx?.items ?? [];
  const loading = ctx?.loading ?? true;
  const error = ctx?.error;

  const errorMessage = typeof error === 'string' ? error : error?.message;


  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'title';
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'asc' });

  // State to track which months are expanded/open
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
  };

  const expandAll = () => {
    const allOpen = Object.fromEntries(groupedByMonth.map(([key]) => [key, true]));
    setExpandedMonths(allOpen);
  };

  // Local state to store edited tags, keyed by the clock's date
  const [localTags, setLocalTags] = useState<Record<string, string>>({});

  // Initialize local state when items are loaded
  useEffect(() => {
    if (items.length > 0) {
      const initialTags: Record<string, string> = {};
      items.forEach((item) => {
        initialTags[item.date] = (item.tags ?? []).join(', ');
      });
      setLocalTags(initialTags);
    }
  }, [items]);

  const handleTagChange = (date: string, value: string) => {
    setLocalTags((prev) => ({ ...prev, [date]: value }));
  };

  const handleSort = (key: 'date' | 'title') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const groupedByMonth = useMemo(() => {
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.date.includes(searchTerm)
    );

    const sorted = [...filtered].sort((a, b) => {
      const valA = String(a[sortConfig.key] || '');
      const valB = String(b[sortConfig.key] || '');

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const groups: Record<string, typeof sorted> = {};
    sorted.forEach(item => {
      // Group by month for dates, or by first letter for titles
      const groupKey = sortConfig.key === 'date' 
        ? item.date.substring(0, 5) 
        : item.title.charAt(0).toUpperCase() || '#';
        
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });

    return Object.entries(groups).sort(([a], [b]) => {
      return sortConfig.direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });
  }, [items, sortConfig, searchTerm]);

  if (errorMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>Error: {errorMessage}</div>
      </div>
    );
  }


  // Extract all unique tags from all items for the dropdown
  const allExistingTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => {
      (item.tags ?? []).forEach((tag) => tags.add(tag));
    });
    return sortTags(tags);
  }, [items]);


  const editedClockPagesJson = useMemo(() => {
    const updated = items.map((it) => {
      const tagsInput = localTags[it.date] ?? '';
      const parsedTags = normalizeTags(tagsInput);
      
      // Ensure we only export keys that belong in the JSON
      // and strip runtime injections like clockNumber
      return {
        path: it.path,
        date: it.date,
        title: it.title,
        tags: parsedTags.length ? parsedTags : undefined,
      };
    });

    return JSON.stringify(updated, null, 2);
  }, [items, localTags]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Loading clock list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '1000px' }}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Bulk Tag Manager</h1>
          <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className={styles.field} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            className={styles.input}
            style={{ flex: 1 }}
            placeholder="Search by title or date (YY-MM-DD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className={sortStyles.sortContainer} style={{ margin: 0 }}>
            <button
              type="button"
              onClick={() => handleSort('date')}
              className={`${sortStyles.sortButton} ${sortConfig.key === 'date' ? sortStyles.active : ''}`}
            >
              date
              {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? ' ↓' : ' ↑') : ''}
            </button>
            <button
              type="button"
              onClick={() => handleSort('title')}
              className={`${sortStyles.sortButton} ${sortConfig.key === 'title' ? sortStyles.active : ''}`}
            >
              title
              {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? ' ↓' : ' ↑') : ''}
            </button>
          </div>

          <button className={styles.buttonSecondary} onClick={expandAll} style={{ whiteSpace: 'nowrap' }}>
            Expand All
          </button>
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '2rem', paddingRight: '10px' }}>
          {groupedByMonth.map(([monthKey, monthItems]) => (
            <div key={monthKey} style={{ marginBottom: '1rem', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => toggleMonth(monthKey)}
                style={{
                  width: '100%', padding: '0.75rem 1.25rem', background: '#fcfcfc', border: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', fontWeight: 'bold', borderBottom: expandedMonths[monthKey] ? '1px solid #eee' : 'none'
                }}
              >
                <span style={{ fontSize: '1.1rem', color: '#333' }}>{monthKey} ({monthItems.length} clocks)</span>
                <span style={{ fontSize: '1.4rem' }}>{expandedMonths[monthKey] ? '−' : '+'}</span>
              </button>
              
              {expandedMonths[monthKey] && (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                  <thead>
                    <tr style={{ background: '#fafafa', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Preview</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => handleSort('date')}>Date</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => handleSort('title')}>Title</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthItems.map((item) => (
                      <tr key={item.date} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '0.5rem' }}>
                          <div style={{ width: '32px', margin: '0 auto' }}>
                            <Thumbnail date={item.date} title={item.title} style={{ borderRadius: '4px' }} />
                          </div>
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.date}</td>
                        <td style={{ padding: '0.5rem', fontSize: '0.9rem' }}>{item.title}</td>
                        <td style={{ padding: '0.5rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px', justifyContent: 'center' }}>
                            {normalizeTags(localTags[item.date] ?? '').map(tag => (
                              <span key={tag} style={{ 
                                backgroundColor: '#f1f3f5', color: '#495057', fontSize: '10px', 
                                padding: '1px 5px', borderRadius: '3px', border: '1px solid #dee2e6' 
                              }}>{tag}</span>
                            ))}
                          </div>
                          <input
                            className={styles.input}
                            style={{ margin: '0 0 4px 0', width: '100%', fontSize: '0.85rem' }}
                            value={localTags[item.date] ?? ''}
                            onChange={(e) => handleTagChange(item.date, e.target.value)}
                            placeholder="Add tags..."
                          />
                          <select
                            className={styles.select}
                            value=""
                            onChange={(e) => {
                              const selectedTag = e.target.value;
                              if (selectedTag) {
                                const current = normalizeTags(localTags[item.date] ?? '');
                                if (!current.includes(selectedTag)) {
                                  const next = [...current, selectedTag];
                                  setLocalTags((prev) => ({
                                    ...prev,
                                    [item.date]: next.join(', '),
                                  }));
                                }
                              }
                            }}
                          >
                            <option value="" disabled>
                              Add existing tag...
                            </option>
                            {allExistingTags.map((tag) => (
                              <option key={tag} value={tag}>
                                {tag}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}

          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Generated JSON (preview only)</h2>
            <textarea
              readOnly
              value={editedClockPagesJson}
              style={{
                width: '100%',
                minHeight: '160px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

            