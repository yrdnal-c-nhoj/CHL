import { useMemo, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import listStyles from '../styles/ClockList.module.css';
import titleStyles from '../styles/ClockTitleTags.module.css';
import type { ClockItem } from '../types/data';
import ClockResults from './ClockResults';
import Footer from './Footer';
import TopNav from './TopNav';

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

  return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <div className={titleStyles.titleRow}>
        <h1 className={titleStyles.title}>{title}</h1>
      </div>
      <ClockResults items={filteredItems} loading={loading} error={error} />
      <Footer />
    </div>
  );
};

export default TagList;