import React from 'react';

interface ClockPageNavProps {
  prevItem: any | null;
  nextItem: any | null;
  currentItem: any;
  formatTitle: (title: string | null | undefined) => string;
  formatDate: (date: string | null | undefined) => string;
}

const ClockPageNav: React.FC<ClockPageNavProps> = ({ prevItem, nextItem, currentItem, formatTitle, formatDate }) => {
  return (
    <nav>
      <div>
        {prevItem && (
          <a href={`/${prevItem.date}`}>
            <span aria-hidden="true">⇽</span>
          </a>
        )}
      </div>
      <div>
        <h1>{formatTitle(currentItem?.title)}</h1>
        <p>{formatDate(currentItem?.date)}</p>
      </div>
      <div>
        {nextItem && (
          <a href={`/${nextItem.date}`}>
            <span aria-hidden="true">⇾</span>
          </a>
        )}
      </div>
    </nav>
  );
};

export default ClockPageNav;
