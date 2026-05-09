import React, { useState } from 'react';
import { getThumbnailByDate } from '@/utils/thumbnailMap';

interface ThumbnailProps {
  date: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Shared Thumbnail component with error handling and fallback UI.
 * Looks for thumbnail images in /src/assets/thumbnails/[date]-*.webp
 */
const Thumbnail = ({ date, title, className, style }: ThumbnailProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getThumbnailByDate(date);

  const handleImageError = () => {
    // Logging the specific missing path helps debug naming mismatches
    console.warn(`[Thumbnail] Missing: thumbnails/${date}-*.webp`);
    setImageError(true);
  };

  if (imageError || !imageUrl) {
    return (
      <div className={className} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        color: 'rgba(157, 161, 168, 0.5)',
        fontSize: '0.6rem',
        textAlign: 'center',
        border: '1px solid rgba(157, 161, 168, 0.1)',
        ...style
      }}>
        No Image
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={className}
      style={style}
      loading="lazy"
      onError={handleImageError}
    />
  );
};

export default Thumbnail;