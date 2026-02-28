import React, { useState, useEffect } from 'react';

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load MP4 from corresponding date folder
    const loadVideo = async () => {
      try {
        // Try to find MP4 files in the date folder
        const videoModules = import.meta.glob('/src/assets/images/26-02/26-02-27/*.{mp4,MP4}', { eager: true });
        const videoUrls = Object.values(videoModules).map(module => module.default);
        
        if (videoUrls.length > 0) {
          setVideoSrc(videoUrls[0]);
          console.log('Found video:', videoUrls[0]);
        } else {
          console.log('No MP4 found in 26-02-27 folder');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading video:', error);
        setLoading(false);
      }
    };

    loadVideo();
  }, []);

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '18px' }}>
          Loading video...
        </div>
      </div>
    );
  }

  if (!videoSrc) {
    return (
      <div style={containerStyle}>
        <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '18px', textAlign: 'center' }}>
          No MP4 video found in 26-02-27 folder
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <video
        src={videoSrc}
        style={videoStyle}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
      />
    </div>
  );
};

export default VideoPlayer;
