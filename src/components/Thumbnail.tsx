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
 * Always renders as a perfect square (1:1 aspect ratio) regardless of
 * caller-supplied styles, in every component and every situation.
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

  // Strip any caller-supplied sizing that would break the 1:1 ratio.
  const {
    height: _height,
    aspectRatio: _aspectRatio,
    ...restStyle
  } = (style ?? {}) as React.CSSProperties;
  void _height;
  void _aspectRatio;

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    ...restStyle,
    // Enforced after spread so callers cannot override squareness.
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    display: 'block',
  };

  if (imageError || !imageUrl) {
    return (
      <div
        className={className}
        style={{
          ...wrapperStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          color: 'rgba(157, 161, 168, 0.5)',
          fontSize: '0.6rem',
          textAlign: 'center',
          border: '1px solid rgba(157, 161, 168, 0.1)',
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <div className={className} style={wrapperStyle}>
      {/* onError is required for fallback when thumbnail files are missing */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};

export default Thumbnail;
