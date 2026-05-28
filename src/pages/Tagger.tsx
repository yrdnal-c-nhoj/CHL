import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Thumbnail from '../components/Thumbnail';
import { DataContext } from '../context/DataContext';
import styles from '../styles/Tagger.module.css';
import type { ClockItem, DataContextType } from '../types/data';
import { normalizeTags, sortTags } from '../utils/tagUtils';

const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;

export default function Tagger() {
  const { date } = useParams();
  const navigate = useNavigate();

  const ctx = useContext(DataContext) as DataContextType | undefined;
  const items = ctx?.items ?? [];
  const loading = ctx?.loading ?? true;
  const contextError = ctx?.error;

  const currentItem: ClockItem | null = useMemo(() => {
    if (!date || !items.length) return null;
    return items.find((i) => i.date === date) ?? null;
  }, [date, items]);

  const [tagInput, setTagInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const allExistingTags = useMemo(() => {
    if (!items.length) return [];
    const tags = new Set<string>();
    items.forEach(item => {
      (item.tags ?? []).forEach(tag => tags.add(tag));
    });
    return sortTags(tags);
  }, [items]);

  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) return;
    if (!currentItem) return;
    const tags = currentItem.tags ?? [];
    setTagInput(tags.join(', '));
    setError(null);
  }, [currentItem, date]);

  const editedClockPagesJson = useMemo(() => {
    if (!currentItem) return null;

    const parsedTags = normalizeTags(tagInput);

    // Update only this entry, keep everything else the same.
    // Note: DataContext already injects clockNumber, but that isn't part of the
    // static json. We preserve any other keys we already have.
    const updated = items.map((it) => {
      if (it.path === currentItem.path && it.date === currentItem.date) {
        return {
          ...it,
          tags: parsedTags.length ? parsedTags : undefined,
        };
      }
      return it;
    });

    return JSON.stringify(updated, null, 2);
  }, [currentItem, items, tagInput]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Tagger</h1>
          <pre className={styles.preError}>{error}</pre>
          <button className={styles.button} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Tagger</h1>
          <pre className={styles.preError}>{contextError instanceof Error ? contextError.message : String(contextError)}</pre>
          <button className={styles.button} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!date || !DATE_REGEX.test(date)) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Tagger</h1>
          <p className={styles.help}>Route must be /tagger/YY-MM-DD</p>
          <button className={styles.button} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Tagger</h1>
          <p className={styles.help}>Loading clock list…</p>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Tagger</h1>
          <p className={styles.help}>
            No clock found for date <code>{date}</code>.
          </p>
          <button className={styles.button} onClick={() => navigate('/list')}>
            Go to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Tagger</h1>
          <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
        <Thumbnail 
          date={currentItem.date} 
          title={currentItem.title} 
          style={{ width: '200px', borderRadius: '8px', flexShrink: 0 }} 
        />

        <div style={{ flex: 1 }}>
          <div className={styles.metaRow}>
            <div>
              <div className={styles.label}>Date</div>
              <div className={styles.value}>
                <code>{currentItem.date}</code>
              </div>
            </div>
            <div>
              <div className={styles.label}>Title</div>
              <div className={styles.value}>{currentItem.title}</div>
            </div>
          </div>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Tags</div>
          <div className={styles.help}>
            Comma-separated. Example: <code>neon, geometry, animal</code>
          </div>
          <label className={styles.srOnly} htmlFor="tagInput">
            Tags input
          </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            id="tagInput"
            className={styles.input}
            style={{ flex: 1, margin: 0 }}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="tag1, tag2"
          />
          <select
            className={styles.select}
            value=""
            onChange={(e) => {
              const selectedTag = e.target.value;
              if (selectedTag) {
                const currentTags = tagInput.trim();
                const newTags = currentTags ? `${currentTags}, ${selectedTag}` : selectedTag;
                setTagInput(newTags);
              }
              e.target.value = '';
            }}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="" disabled>Add existing...</option>
            {allExistingTags.map(tag => (<option key={tag} value={tag}>{tag}</option>))}
          </select>
        </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={async () => {
              try {
                if (!editedClockPagesJson) return;
                await navigator.clipboard.writeText(editedClockPagesJson);
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : 'Clipboard write failed. Copy from the textarea instead.',
                );
              }
            }}
          >
            Copy updated clockpages.json
          </button>

          <button
            className={styles.buttonSecondary}
            onClick={() => {
              if (!editedClockPagesJson) return;
              // Trigger a download as a convenience.
              const blob = new Blob([editedClockPagesJson], {
                type: 'application/json',
              });
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

        <div className={styles.field}>
          <div className={styles.label}>Updated JSON (paste into src/context/clockpages.json)</div>
          <textarea
            className={styles.textarea}
            value={editedClockPagesJson ?? ''}
            readOnly
          />
        </div>

        <p className={styles.notice}>
          This page generates an updated JSON blob in-browser. To make it permanent,
          paste it into <code>src/context/clockpages.json</code> and rebuild.
        </p>
      </div>
    </div>
  );
}
