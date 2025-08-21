import React, { useEffect, useRef, useState } from 'react';
import customFont from './wide.ttf'; // Your font file

const NumberLineClock = () => {
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  const [itemWidths, setItemWidths] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidths = () => {
      const refs = [
        { ref: secondsRef.current, key: 'seconds' },
        { ref: minutesRef.current, key: 'minutes' },
        { ref: hoursRef.current, key: 'hours' },
      ];

      let newContainerWidth = 0;
      const newItemWidths = { hours: 0, minutes: 0, seconds: 0 };

      refs.forEach(({ ref, key }) => {
        if (!ref) return;

        if (key === 'seconds') {
          newContainerWidth = ref.clientWidth;
        }

        const firstNumberItem = ref.children[1];
        if (firstNumberItem) {
          const style = window.getComputedStyle(firstNumberItem);
          const marginLeft = parseFloat(style.marginLeft);
          const marginRight = parseFloat(style.marginRight);
          const width = firstNumberItem.offsetWidth + marginLeft + marginRight;
          newItemWidths[key] = width;
        }
      });

      setItemWidths(newItemWidths);
      setContainerWidth(newContainerWidth);
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  useEffect(() => {
    if (!itemWidths.seconds || !itemWidths.minutes || !itemWidths.hours || !containerWidth) return;

    let animationFrameId;

    const updateScrollPositions = () => {
      const now = new Date();
      
      // Get 24-hour format and convert to 12-hour
      let hours24 = now.getHours();
      let hours12 = hours24 % 12;
      if (hours12 === 0) hours12 = 12; // Convert 0 to 12 for 12 AM/PM
      
      const minutes = now.getMinutes();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000; // Smooth scroll

      if (hoursRef.current) {
        // Position between numbers - at 0 minutes, center between 12 and 1
        const currentHour = hours12 - 1; // Convert to 0-based index (0-11)
        const hourPosition = currentHour + minutes / 60; // Progress through the hour
        // Position between the current hour and next hour
        const targetScrollLeft = hourPosition * itemWidths.hours - containerWidth / 2 + itemWidths.hours;
        hoursRef.current.scrollLeft = targetScrollLeft;
      }

      if (minutesRef.current) {
        // Position between numbers - progress through the minute
        const minutePosition = minutes + seconds / 60;
        const targetScrollLeft = minutePosition * itemWidths.minutes - containerWidth / 2 + itemWidths.minutes;
        minutesRef.current.scrollLeft = targetScrollLeft;
      }

      if (secondsRef.current) {
        // Position between numbers - progress through the second
        const targetScrollLeft = seconds * itemWidths.seconds - containerWidth / 2 + itemWidths.seconds;
        secondsRef.current.scrollLeft = targetScrollLeft;
      }

      animationFrameId = requestAnimationFrame(updateScrollPositions);
    };

    animationFrameId = requestAnimationFrame(updateScrollPositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [itemWidths, containerWidth]);

  const renderNumberLine = (count, ref, margin) => (
    <div style={{ marginBottom: '2rem' }}>
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
            backgroundColor: '#A78906FF',
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
                margin: `0 ${margin}`,
                color: '#F0E4F3FF',
                fontWeight: 'normal',
                fontSize: '2.5rem',
                userSelect: 'none',
                width: '2rem',
                fontFamily: 'CustomFont, sans-serif',
                lineHeight: 1,
              }}
            >
              <div style={{ marginBottom: '0.3rem', lineHeight: 1 }}>
                {ref === hoursRef ? (i + 1).toString().padStart(2, '0') : i.toString().padStart(2, '0')}
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
        opacity: 0.9,
        backgroundImage:
          'linear-gradient(#444cf7 0.4px, transparent 0.4px), linear-gradient(to right, #444cf7 0.4px, #2a331c 0.4px)',
        backgroundSize: '4px 12px',
        fontFamily: 'CustomFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        {renderNumberLine(12, hoursRef, '10rem')}
        {renderNumberLine(60, minutesRef, '10rem')}
        {renderNumberLine(60, secondsRef, '10rem')}
      </div>
    </div>
  );
};

export default NumberLineClock;