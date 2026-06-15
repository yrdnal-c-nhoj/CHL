import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav'; // Import the shared TopNav component
import { useDataContext } from '../context/DataContext';
import styles from '../styles/AllTagsPage.module.css';
import sortStyles from '../styles/SortControls.module.css';

type SortOption = 'name-asc' | 'name-desc' | 'count-desc' | 'count-asc';

const AllTagsPage: React.FC = () => {
  const { items, loading, error } = useDataContext();
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  const tagsWithCounts = useMemo(() => {
    const tagMap = new Map<string, number>();

    items.forEach((item) => {
      (item.tags ?? []).forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      });
    });

    const tagData = Array.from(tagMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    return tagData.sort((a, b) => {
      if (sortBy === 'count-desc') {
        return b.count - a.count || a.name.localeCompare(b.name);
      }
      if (sortBy === 'count-asc') {
        return a.count - b.count || a.name.localeCompare(b.name);
      }

      const aIsAlpha = /^[a-zA-Z]/.test(a.name);
      const bIsAlpha = /^[a-zA-Z]/.test(b.name);

      // For name sorting, group tags starting with letters first, then numbers/others
      if (aIsAlpha && !bIsAlpha) return -1;
      if (!aIsAlpha && bIsAlpha) return 1;

      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);

      return 0;
    });
  }, [items, sortBy]);

  const handleNameSort = () =>
    setSortBy((prev) => (prev === 'name-asc' ? 'name-desc' : 'name-asc'));

  const handleCountSort = () =>
    setSortBy((prev) => (prev === 'count-desc' ? 'count-asc' : 'count-desc'));

  if (error) {
    return <div className={styles.container}>Error loading tags: {error.message}</div>;
  }

  if (loading) {
    return <div className={styles.container}>Loading tags...</div>;
  }

  return (
    <div className={styles.container}>
      <TopNav />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={sortStyles.sortContainer}>
            <button
              type="button"
              onClick={handleNameSort}
              className={`${sortStyles.sortButton} ${sortBy.startsWith('name') ? sortStyles.active : ''}`}
            >
              abc
              {sortBy === 'name-asc' ? '↓' : sortBy === 'name-desc' ? '↑' : ''}
            </button>
            <button
              type="button"
              onClick={handleCountSort}
              className={`${sortStyles.sortButton} ${sortBy.startsWith('count') ? sortStyles.active : ''}`}
            >
              usage
              {sortBy === 'count-asc' ? '↓' : sortBy === 'count-desc' ? '↑' : ''}
            </button>
          </div>
        </header>

        <div className="tagContainer">
          {tagsWithCounts.map(({ name, count }) => (
            <Link
              key={name}
              to={`/tag/${name}`}
              className="tag-bubble tag-bubble--large"
            >
              {name} ({count})
            </Link>
          ))}
        </div>

        <footer className={styles.footer}>
          <p>
            {tagsWithCounts.length} unique tags across {items.length} clocks.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AllTagsPage;
