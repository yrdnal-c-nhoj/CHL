import React, { useEffect, useState } from 'react';

const Clock = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [embedBlocked, setEmbedBlocked] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();

    // Check for embed blocking after a delay
    const checkTimer = setTimeout(() => {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        // Try to detect if iframe is blocked
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (!iframeDoc || iframeDoc.title.includes('blocked')) {
            setEmbedBlocked(true);
          }
        } catch (e) {
          // Cross-origin error likely means blocked
          setEmbedBlocked(true);
        }
      }
    }, 3000);

    return () => clearTimeout(checkTimer);
  }, []);

  const webcamUrl = "https://www.skylinewebcams.com/en/webcam/mexico/quintana-roo/solidaridad/el-parque-de-xcaret.html";
  const directUrl = "https://www.skylinewebcams.com/en/webcam/mexico/quintana-roo/solidaridad/el-parque-de-xcaret.html";

  const handleOpenDirect = () => {
    window.open(directUrl, '_blank');
  };

  const handleForceReload = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = webcamUrl + '?t=' + Date.now();
    }
  };

  if (embedBlocked) {
    return (
      <div style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <div style={{
            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
            marginBottom: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Xcaret Webcam
          </div>
          <div style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            opacity: 0.8,
            marginBottom: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Server blocks embedding (X-Frame-Options)
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleOpenDirect}
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '1rem 2rem',
                border: '2px solid #fff',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              Open Webcam
            </button>
            <button
              onClick={handleForceReload}
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '1rem 2rem',
                border: '2px solid #ff6b6b',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* Xcaret Webcam Feed */}
      <iframe
        src={webcamUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: isMobile ? 'none' : 'auto'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="Xcaret Live Webcam"
        scrolling="no"
      />
      
      {/* Mobile touch overlay */}
      {isMobile && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            cursor: 'pointer'
          }}
          onClick={handleForceReload}
          onTouchStart={handleForceReload}
        />
      )}
    </div>
  );
};

export default Clock;
