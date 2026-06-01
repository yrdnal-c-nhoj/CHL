import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Thumbnail from '../components/Thumbnail';
import { DataContext } from '../context/DataContext';
import styles from '../styles/Tagger.module.css'; // Reusing Tagger styles for consistency
import type { DataContextType } from '../types/data';
import { normalizeTags, sortTags } from '../utils/tagUtils';

export default function TagManager() {
  const navigate = useNavigate();
  const ctx = useContext(DataContext) as DataContextType | undefined;
  const items = ctx?.items ?? [];
  const loading = ctx?.loading ?? true;
  const error = ctx?.error;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'title';
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'asc' });

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

  const sortedItems = useMemo(() => {
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.date.includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      // Use a type-safe key access
      const key = sortConfig.key;
      const valA = (a[key] || '').toString();
      const valB = (b[key] || '').toString();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig, searchTerm]);

  if (error) {
    return <div className={styles.container}><div className={styles.card}>Error: {error.message}</div></div>;
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

        <div className={styles.field} style={{ marginBottom: '1rem' }}>
          <input 
            className={styles.input}
            placeholder="Search by title or date (YY-MM-DD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: '2rem', border: '1px solid #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '0.5rem', borderBottom: '2px solid #eee' }}>Preview</th>
                <th
                  style={{ padding: '0.5rem', borderBottom: '2px solid #eee', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('date')}
                >
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th
                  style={{ padding: '0.5rem', borderBottom: '2px solid #eee', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('title')}
                >
                  Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th style={{ padding: '0.5rem', borderBottom: '2px solid #eee' }}>Tags (comma separated)</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.date} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '0.5rem' }}>
                      <Thumbnail 
                      date={item.date}
                      title={item.title} 
                      style={{ width: '48px', borderRadius: '4px' }} 
                    />
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{item.date}</td>
                  <td style={{ padding: '0.5rem' }}>{item.title}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <input
                      className={styles.input}
                      style={{ margin: 0, width: '100%' }}
                      value={localTags[item.date] ?? ''}
                      onChange={(e) => handleTagChange(item.date, e.target.value)}
                      placeholder="neon, geometry..."
                    />
                    <select
                      className={styles.select} // Add this class to Tagger.module.css
                      value="" // Controlled component, but we want it to reset after selection
                      onChange={(e) => {
                        const selectedTag = e.target.value;
                        if (selectedTag) {
                          const currentTags = localTags[item.date] ?? '';
                          const newTags = currentTags ? `${currentTags}, ${selectedTag}` : selectedTag;
                          handleTagChange(item.date, newTags);
                        }
                        e.target.value = ''; // Reset the select to the default option
                      }}
                      style={{ width: 'auto', minWidth: '150px' }}
                    >
                      <option value="" disabled>Add existing tag...</option>
                      {allExistingTags.map(tag => (<option key={tag} value={tag}>{tag}</option>))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={async () => {
              await navigator.clipboard.writeText(editedClockPagesJson);
              alert('Copied to clipboard!');
            }}
          >
            Copy Updated JSON
          </button>

          <button
            className={styles.buttonSecondary}
            onClick={() => {
              const blob = new Blob([editedClockPagesJson], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'clockpages.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download JSON
          </button>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>JSON Output</div>
          <textarea
            className={styles.textarea}
            style={{ height: '200px', fontSize: '11px' }}
            value={editedClockPagesJson}
            readOnly
          />
        </div>

        <p className={styles.notice}>
          Edit tags in the list above. When finished, copy or download the JSON and 
          paste it into <code>src/context/clockpages.json</code>.
        </p>
      </div>
    </div>
  );
}