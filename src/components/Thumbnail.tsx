import React from 'react';

interface ThumbnailProps {
  date: string;
  title?: string;
  className?: string | undefined;
  style?: React.CSSProperties;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ date, title, className, style }) => {
  return (
    <div className={className} style={style}>
      <h2>{title}</h2>
      <p>{date}</p>
    </div>
  );
};

export default Thumbnail;
