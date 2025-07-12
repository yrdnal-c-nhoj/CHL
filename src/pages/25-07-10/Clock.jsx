import { useEffect, useRef, useState } from 'react';
import sliFont from './sli.otf';
import sli2Font from './sli2.ttf';

const Clock = () => {
  const digitGroups = ['hour-tens', 'hour-ones', 'minute-tens', 'minute-ones', 'second-tens', 'second-ones'];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const digitSize = 2.375 * 16;

    // Inject fonts + style for .digit and .current
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @font-face {
        font-family: 'sli';
        src: url(${sliFont}) format('opentype');
      }
      @font-face {
        font-family: 'sli2';
        src: url(${sli2Font}) format('truetype');
      }
      .digit {
        font-family: 'sli', cursive, sans-serif !important;
        font-size: 3.125rem !important;
        color: rgb(246, 187, 244) !important;
      }
      .digit-strip .digit.current {
        font-family: 'sli2', Courier, monospace !important;
        font-size: 1.4375rem !important;
        color: rgb(98, 105, 174) !important;
      }
    `;
    document.head.appendChild(styleSheet);

    const updateClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'P' : 'A';
      h = h % 12 || 12;
      const hStr = h.toString().padStart(2, '0');
      const digits = [...hStr, ...m, ...s];

      digitGroups.forEach((id, i) => {
        const group = document.getElementById(id);
        const strip = group?.querySelector('.digit-strip');
        const digitElements = strip?.querySelectorAll('.digit');
        const val = parseInt(digits[i]);
        const groupRect = group?.getBoundingClientRect();
        const offset = isMobile
          ? window.innerWidth / 2 - (groupRect?.left + val * digitSize + digitSize / 2)
          : window.innerHeight / 2 - (groupRect?.top + val * digitSize + digitSize / 2);
        strip.style.transform = isMobile
          ? `translateX(${offset / 16}rem)`
          : `translateY(${offset / 16}rem)`;
        digitElements?.forEach((d, j) => {
          d.classList.toggle('current', j === val);
        });
      });

      const ampmGroup = document.getElementById('ampm-indicator');
      const ampmStrip = ampmGroup?.querySelector('.digit-strip');
      const ampmDigits = ampmStrip?.querySelectorAll('.digit');
      const ampmIndex = ampm === 'A' ? 0 : 1;
      const ampmRect = ampmGroup?.getBoundingClientRect();
      const ampmOffset = isMobile
        ? window.innerWidth / 2 - (ampmRect?.left + ampmIndex * digitSize + digitSize / 2)
        : window.innerHeight / 2 - (ampmRect?.top + ampmIndex * digitSize + digitSize / 2);
      ampmStrip.style.transform = isMobile
        ? `translateX(${ampmOffset / 16}rem)`
        : `translateY(${ampmOffset / 16}rem)`;
      ampmDigits?.forEach((d, i) => {
        d.classList.toggle('current', i === ampmIndex);
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    window.addEventListener('resize', updateClock);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateClock);
    };
  }, [isMobile]);

  const createDigitStrip = (id) => {
    const maxDigit = id === 'hour-tens' ? 2 : 9;
    return Array.from({ length: maxDigit + 1 }, (_, digit) => (
      <div
        key={digit}
        className="digit"
        style={{
          width: '2.375rem',
          height: '2.375rem',
          lineHeight: '2.375rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {digit}
      </div>
    ));
  };

  const createAmPmStrip = () =>
    ['A', 'P'].map((letter) => (
      <div
        key={letter}
        className="digit"
        style={{
          width: '2.375rem',
          height: '2.375rem',
          lineHeight: '2.375rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {letter}
      </div>
    ));

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#080807',
        overflow: 'hidden',
      }}
    >
      <div
        className="clock-container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {digitGroups.map((id) => (
          <div
            key={id}
            id={id}
            className="digit-group"
            style={{
              width: isMobile ? '14.25rem' : '2.375rem',
              height: isMobile ? '2.375rem' : '14.25rem',
              overflow: 'visible',
              position: 'relative',
              display: isMobile ? 'flex' : 'block',
              alignItems: isMobile ? 'center' : 'initial',
            }}
          >
            <div
              className="digit-strip"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                position: 'absolute',
                top: 0,
                left: 0,
                transition: 'transform 0.3s ease',
              }}
            >
              {createDigitStrip(id)}
            </div>
            <div
              className="window"
              style={{
                position: 'absolute',
                top: isMobile ? 0 : '50%',
                left: isMobile ? '50%' : 0,
                transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
                width: '2.375rem',
                height: '2.375rem',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}

        <div
          id="ampm-indicator"
          className="ampm-group"
          style={{
            width: isMobile ? '14.25rem' : '2.375rem',
            height: isMobile ? '2.375rem' : '14.25rem',
            overflow: 'visible',
            position: 'relative',
            display: isMobile ? 'flex' : 'block',
            alignItems: isMobile ? 'center' : 'initial',
          }}
        >
          <div
            className="digit-strip"
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'transform 0.3s ease',
            }}
          >
            {createAmPmStrip()}
          </div>
          <div
            className="window"
            style={{
              position: 'absolute',
              top: isMobile ? 0 : '50%',
              left: isMobile ? '50%' : 0,
              transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
              width: '2.375rem',
              height: '2.375rem',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div
          id="static-m"
          className="ampm-group"
          style={{
            width: '2.375rem',
            height: '2.375rem',
            position: 'relative',
          }}
        >
          <div
            className="static-m"
            style={{
              width: '2.375rem',
              height: '2.375rem',
              lineHeight: '2.375rem',
              textAlign: 'center',
              fontSize: '1.4375rem',
              position: 'absolute',
              top: isMobile ? 0 : '50%',
              left: isMobile ? '50%' : 0,
              transform: isMobile ? 'translateX(-50%)' : 'translateY(-50%)',
              color: 'rgb(98, 105, 174)',
              fontFamily: "'sli2', Courier, monospace",
            }}
          >
            M
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;