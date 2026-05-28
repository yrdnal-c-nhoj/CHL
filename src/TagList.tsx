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
        <div className={listStyles.controls} style={{ flexDirection: 'column', gap: '0.2rem' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-arimo)', 
            // margin: '1rem 0 0.5rem 0',
            textTransform: 'uppercase',
            // letterSpacing: '0.05rem'
          }}>
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
                  <div className={listStyles.tagsWrapper}>
                    {[...(item.tags || [])]
                      .sort((a, b) => a.localeCompare(b))
                      .map((t) => (
                        <Link 
                          key={t} 
                          to={`/tag/${t}`}
                          className={listStyles.tagBubble}
                          onClick={(e: MouseEvent) => e.stopPropagation()}
                          style={{ 
                          backgroundColor: t === tag ? 'var(--color-lab-blue-deep)' : '#d4d5d7',
                          color: t === tag ? 'white' : '#393a3b'
                        }}>
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