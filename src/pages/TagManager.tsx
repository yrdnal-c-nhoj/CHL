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
  }>({ key: 'date', direction: 'desc' });

  // State to track which months are expanded/open
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({
    // Default the first month to open if it exists
  });

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
  };

  const expandAll = () => {
    const allOpen = Object.fromEntries(groupedByMonth.map(([key]) => [key, true]));
    setExpandedMonths(allOpen);
  };

  const collapseAll = () => {
    setExpandedMonths({});
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

  const toggleTag = (date: string, tag: string) => {
    const currentTags = normalizeTags(localTags[date] ?? '');
    let nextTags: string[];
    
    if (currentTags.includes(tag)) {
      nextTags = currentTags.filter(t => t !== tag);
    } else {
      nextTags = [...currentTags, tag];
    }
    
    setLocalTags(prev => ({ ...prev, [date]: nextTags.join(', ') }));
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
      const parsedTags = sortTags(new Set(normalizeTags(tagsInput)));
      
      // Ensure we only export keys that belong in the JSON
      // and strip runtime injections like clockNumber for the final blob
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

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={styles.buttonSecondary} onClick={expandAll} style={{ whiteSpace: 'nowrap', padding: '0.5rem' }}>
              Expand All
            </button>
            <button className={styles.buttonSecondary} onClick={collapseAll} style={{ whiteSpace: 'nowrap', padding: '0.5rem' }}>
              Collapse All
            </button>
          </div>
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
                <span style={{ fontSize: '1.1rem', color: '#333' }}>
                  {sortConfig.key === 'date' ? `Month: ${monthKey}` : `Starting with: ${monthKey}`} 
                  <small style={{ marginLeft: '10px', color: '#888', fontWeight: 'normal' }}>({monthItems.length} clocks)</small>
                </span>
                <span style={{ fontSize: '1.4rem' }}>{expandedMonths[monthKey] ? '−' : '+'}</span>
              </button>
              
              {expandedMonths[monthKey] && (
                <div style={{ padding: '0.5rem' }}>
                  {monthItems.map((item) => (
                    <div key={item.date} style={{ 
                      display: 'flex', 
                      gap: '1.5rem', 
                      padding: '1rem', 
                      borderBottom: '1px solid #f0f0f0',
                      alignItems: 'flex-start'
                    }}>
                      {/* Left: Thumbnail Link */}
                      <a 
                        href={`/${item.date}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ width: '100px', flexShrink: 0, display: 'block' }}
                        title="View clock in new window"
                      >
                        <Thumbnail date={item.date} title={item.title} style={{ borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                      </a>

                      {/* Right: Info and Tagging */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>{item.title}</span>
                          <code style={{ fontSize: '0.85rem', color: '#666' }}>{item.date}</code>
                        </div>

                        <div className={styles.field} style={{ margin: 0 }}>
                          {/* Active Tags */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                            {normalizeTags(localTags[item.date] ?? '').length > 0 ? (
                              normalizeTags(localTags[item.date] ?? '').map(tag => (
                                <button 
                                  key={tag} 
                                  onClick={() => toggleTag(item.date, tag)}
                                  className="tag-bubble"
                                  style={{ border: '1px solid #222', cursor: 'pointer', fontSize: '11px' }}
                                  title="Click to remove"
                                >
                                  {tag} ×
                                </button>
                              ))
                            ) : (
                              <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>No tags selected</span>
                            )}
                          </div>

                          {/* Input and Selection */}
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              className={styles.input}
                              style={{ flex: 1, margin: 0, fontSize: '0.9rem' }}
                              value={localTags[item.date] ?? ''}
                              onChange={(e) => handleTagChange(item.date, e.target.value)}
                              placeholder="Type tags (comma separated)..."
                            />
                            
                            <select
                              className={styles.select}
                              value=""
                              onChange={(e) => {
                                const tag = e.target.value;
                                if (tag) toggleTag(item.date, tag);
                                e.target.value = '';
                              }}
                              style={{ width: 'auto', minWidth: '140px' }}
                            >
                              <option value="" disabled>Add existing...</option>
                              {allExistingTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                              ))}
                            </select>
                          </div>

                          {/* Quick Select Panel (Optional/Suggested) */}
                          <div style={{ 
                            marginTop: '8px', 
                            maxHeight: '40px', 
                            overflowY: 'auto', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '4px' 
                          }}>
                            {allExistingTags.slice(0, 15).map(tag => (
                              <button
                                key={tag}
                                onClick={() => toggleTag(item.date, tag)}
                                style={{ 
                                  fontSize: '10px', padding: '2px 6px', borderRadius: '4px', 
                                  background: 'none', border: '1px solid #ddd', cursor: 'pointer',
                                  color: normalizeTags(localTags[item.date] ?? '').includes(tag) ? '#000' : '#888',
                                  backgroundColor: normalizeTags(localTags[item.date] ?? '').includes(tag) ? '#eee' : 'transparent'
                                }}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

          <div className={styles.actions} style={{ marginTop: '1rem' }}>
            <button
              className={styles.button}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(editedClockPagesJson);
                  alert('JSON copied to clipboard!');
                } catch (e) {
                  console.error('Copy failed', e);
                }
              }}
            >
              Copy updated clockpages.json
            </button>

            <button
              className={styles.buttonSecondary}
              onClick={() => {
                const blob = new Blob([editedClockPagesJson], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'clockpages.updated.json';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
            >
              Download JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
           