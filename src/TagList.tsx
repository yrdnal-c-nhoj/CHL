// TAGSpage that

import { useContext, useMemo, type FC, type MouseEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from './components/Footer';
import Thumbnail from './components/Thumbnail';
import TopNav from './components/TopNav';
import { DataContext } from './context/DataContext';
import listStyles from './styles/ClockList.module.css';
import type { ClockItem, DataContextType } from './types/data';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const TagList: FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const context = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();
  const { items = [], loading = false, error = null } = context || {};

  // Filter by tag and sort newest first (reverse chronological)
  const filteredItems = useMemo<ClockItem[]>(() => {
    if (!tag) return [];
    
    return items
      .filter((item) => item?.date && item.tags?.includes(tag))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [items, tag]);

  if (loading) return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <div className={listStyles.loadingContainer}>Loading tag: {tag}...</div>
      <Footer />
    </div>
  );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <div className={listStyles.centeredContent}>
        <div className="sort-container">
          <h1 className="sort-title">
              {filteredItems.length} {filteredItems.length === 1 ? 'clock' : 'clocks'} found with "{tag}"
          </h1>
        </div>

        <ul className={listStyles.simpleListContainer}>
          {filteredItems.map((item) => (
            <li key={item.date}>
              <div
                className={listStyles.simpleListImage}
                onClick={() => navigate(`/${item.date}`)}
              >
                {/* Column 1: Date */}
                <time
                  className={listStyles.simpleListDate}
                  dateTime={`20${item.date}`}
                >
                  {(() => {
                    const [yy, mm, dd] = item.date.split('-');
                    const monthName = MONTHS[parseInt(mm, 10) - 1] || '???';
                    return (
                      <>
                        <span>{dd.padStart(2, '0')}</span>
                        <span>{monthName}</span>
                        <span>'{yy}</span>
                      </>
                    );
                  })()}
                </time>

                {/* Column 2: Image */}
                <div className={listStyles.thumbnailWrapper}>
                  <Thumbnail date={item.date} title={item.title || ''} />
                </div>

                {/* Column 3: Content Stack */}
                <div className={listStyles.contentStack}>
                  <div className={listStyles.titleNumberRow}>
                    <span className={listStyles.simpleListTitle}>
                      {item.title || 'No Title'}
                    </span>
                    <span className={listStyles.simpleListNumber}>
                      #{item.clockNumber}
                    </span>
                  </div>
                  <div className="tag-wrapper">
                    {[...(item.tags || [])]
                      .sort((a, b) => a.localeCompare(b))
                      .map((t) => (
                        <Link 
                          key={t} 
                          to={`/tag/${t}`}
                          className={`tag-bubble ${t === tag ? 'active' : ''}`}
                          onClick={(e: MouseEvent) => e.stopPropagation()}
                        >
                          {t}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default TagList;