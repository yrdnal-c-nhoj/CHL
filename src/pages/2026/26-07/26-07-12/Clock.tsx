import jumpVideo from '@/assets/images/26_images/26-07/26-07-15/lav.mp4';
import React from 'react';

/**
 * Export the video asset for the application's preloading pipeline.
 * This is required by the `useClockPage` hook to ensure the video is
 * available before the component is rendered.
 */
export const assets = [
  jumpVideo
];

const VideoPlayer: React.FC = () => {
  const videoStyle: React.CSSProperties = {
    position: 'fixed', // Use fixed to cover the entire viewport
    top: '50%',
    left: '50%',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    transform: 'translate(-50%, -50%)', // Center the video
    zIndex: -1, // Place it behind any other content
  };

  return (
    <video autoPlay loop muted playsInline style={videoStyle}>
      <source src={jumpVideo} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;