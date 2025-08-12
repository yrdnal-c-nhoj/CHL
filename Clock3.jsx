import React, { useEffect, useRef, useState } from 'react';
import customFont from './line.ttf'; // Your font file

const NumberLineClock = () => {
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  const [itemWidth, setItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidths = () => {
      const ref = secondsRef.current;
      if (!ref) return;

      setContainerWidth(ref.clientWidth);

      const firstNumberItem = ref.children[1];
      if (firstNumberItem) {
        const style = window.getComputedStyle(firstNumberItem);
        const marginLeft = parseFloat(style.marginLeft);
        const marginRight = parseFloat(style.marginRight);
        const width = firstNumberItem.offsetWidth + marginLeft + marginRight;
        setItemWidth(width);
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  useEffect(() => {
    if (!itemWidth || !containerWidth) return;

    let animationFrameId;
    let justRewound = false;

    const updateScrollPositions = () => {
      const now = new Date();
      const hours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
      const minutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

      const centerOffset = containerWidth / 2;
      const leftPadding = window.innerWidth / 2;

      if (hoursRef.current) {
        const hoursPosition = (hours % 24) * itemWidth;
        hoursRef.current.scrollLeft = hoursPosition + leftPadding - centerOffset + itemWidth / 2;
      }

      if (minutesRef.current) {
        const minutesPosition = (minutes % 60) * itemWidth;
        minutesRef.current.scrollLeft = minutesPosition + leftPadding - centerOffset + itemWidth / 2;
      }

      if (secondsRef.current) {
        if (seconds >= 59.9 && !justRewound) {
          secondsRef.current.scrollLeft = leftPadding - centerOffset + itemWidth / 2;
          justRewound = true;
        } else if (seconds < 1) {
          justRewound = false;
          const secondsPosition = seconds * itemWidth;
          secondsRef.current.scrollLeft = secondsPosition + leftPadding - centerOffset + itemWidth / 2;
        } else if (!justRewound) {
          const secondsPosition = seconds * itemWidth;
          secondsRef.current.scrollLeft = secondsPosition + leftPadding - centerOffset + itemWidth / 2;
        }
      }

      animationFrameId = requestAnimationFrame(updateScrollPositions);
    };

    animationFrameId = requestAnimationFrame(updateScrollPositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [itemWidth, containerWidth]);

  const renderNumberLine = (count, label, ref) => (
    <div style={{ marginBottom: '2rem' }}>
      {label && (
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#2d3748',
            fontFamily: 'CustomFont, sans-serif',
          }}
        >
          {label}
        </h3>
      )}
      <div style={{ position: 'relative' }}>
        {/* Center indicator */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-0.5px)',
            width: '2px',
            height: '100%',
            backgroundColor: 'red',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        {/* Scrollable number line */}
        <div
          ref={ref}
          style={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            cursor: 'default',
          }}
          className="hide-scrollbar"
        >
          {/* Left padding */}
          <div style={{ display: 'inline-block', width: '50vw' }} />

          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                margin: '0 1rem',
                color: '#4a5568',
                fontWeight: 'normal',
                fontSize: '1.125rem',
                userSelect: 'none',
                width: '2rem',
                fontFamily: 'CustomFont, sans-serif',
                lineHeight: 1,
              }}
            >
              <div style={{ marginBottom: '0.3rem', lineHeight: 1 }}>
                {i.toString().padStart(2, '0')}
              </div>
              <div
                style={{
                  width: '2px',
                  height: i % 5 === 0 ? '1.5rem' : '1rem',
                  backgroundColor: i % 5 === 0 ? '#2d3748' : '#a0aec0',
                  margin: '0 auto',
                  borderRadius: '1px',
                }}
              />
              <div
                style={{
                  width: '4rem',
                  height: '2px',
                  backgroundColor: '#2d3748',
                  margin: '0.25rem auto 0',
                }}
              />
            </div>
          ))}

          {/* Right padding */}
          <div style={{ display: 'inline-block', width: '50vw' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #ebf8ff, #0D468DFF)',
        padding: '1.5rem',
        fontFamily: 'CustomFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // vertical center
        alignItems: 'center', // horizontal center
      }}
    >
      <style>{`
        @font-face {
          font-family: 'CustomFont';
          src: url(${customFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div style={{ maxWidth: '72rem', width: '100%' }}>
        {renderNumberLine(24, '', hoursRef)}
        {renderNumberLine(60, '', minutesRef)}
        {renderNumberLine(60, '', secondsRef)}
      </div>
    </div>
  );
};

export default NumberLineClock;
