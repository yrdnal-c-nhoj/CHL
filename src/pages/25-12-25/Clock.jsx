import React, { useState, useEffect } from 'react';
import topoImage from '../../assets/clocks/25-12-25/topo.jpg';

// Constants
const COLORS = {
  primary: '#057CE4',
  secondary: '#8f83a2',
  textDark: '#413E57',
  textLight: '#57552F',
  white: '#fff',
  border: '#e6e6e6',
  borderDashed: '#635354',
  barcode: '#000'
};

const FLIGHT_DATA = {
  airline: 'BorrowedTime',
  flightNumber: 'DY 289',
  passenger: 'Cubist Heart',
  seat: '13d',
  terminal: '3',
  gate: '59',
  origin: { city: 'Paris', code: 'CDG' },
  destination: { city: 'Boston', code: 'BOS' },
  flightDuration: 8 * 60, // minutes
  boardingTime: -20 // minutes before departure
};

// Utility functions
const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const formatTime = (date) => date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

// Generate topographic SVG background with random wavy curves
const generateTopographicSVG = () => {
  const lines = 12; // number of contour lines
  const width = 600;
  const height = 600;
  const colors = ['#503c6f', '#4a3570', '#3f2d5e', '#36264f']; // multiple colors for elevation
  let svgContent = `<svg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'>`;

  for (let i = 0; i < lines; i++) {
    const yBase = (height / lines) * i;
    const color = colors[i % colors.length];
    const opacity = 0.15 + Math.random() * 0.15; // semi-transparent
    const pathPoints = [];

    for (let x = 0; x <= width; x += 20) {
      const yOffset = Math.sin((x / width) * Math.PI * 2 + Math.random()) * 10 * Math.random();
      pathPoints.push(`${x},${yBase + yOffset}`);
    }

    svgContent += `<path d='M${pathPoints.join(' L')}' fill='none' stroke='${color}' stroke-width='1.2' opacity='${opacity}'/>`;
  }

  svgContent += `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`;
};

// Styles
const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '0.625rem',
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.secondary,
    backgroundImage: `url(${topoImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  ticket: {
    width: '90vw',
    maxWidth: '21.25rem',
    color: COLORS.textLight,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    borderRadius: '0.625rem',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.15rem 2.1875rem',
    color: COLORS.white,
    backgroundColor: COLORS.primary
  },
  logo: (fontLoaded) => ({
    fontSize: '1.80rem',
    fontWeight: '400',
    fontStyle: 'italic',
    fontFamily: fontLoaded ? 'Oxanium, sans-serif' : 'sans-serif'
  }),
  flightLabel: {
    fontSize: '0.6875rem',
    textAlign: 'right',
    textTransform: 'uppercase'
  },
  body: {
    position: 'relative',
    borderBottom: `0.0625rem dashed ${COLORS.borderDashed}`,
    backgroundColor: COLORS.white
  },
  notch: (side) => ({
    content: '""',
    position: 'absolute',
    bottom: '-0.5rem',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: COLORS.secondary,
    ...(side === 'left' ? { left: '-0.5rem' } : { right: '-0.5rem' })
  }),
  locations: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem 2.1875rem',
    borderBottom: `0.0625rem solid ${COLORS.border}`
  },
  location: {
    flexGrow: 1,
    flexShrink: 0,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  cityCode: {
    margin: '0.3125rem 0',
    fontSize: '1.625rem',
    color: COLORS.textDark
  },
  arrow: {
    container: {
      position: 'relative',
      display: 'inline-block',
      width: '1.25rem',
      height: '0.125rem',
      backgroundColor: COLORS.primary
    },
    part: (rotation, origin) => ({
      content: '""',
      position: 'absolute',
      width: '0.9375rem',
      height: '0.125rem',
      backgroundColor: COLORS.primary,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: origin
    })
  },
  bodyInfo: {
    padding: '1.25rem 2.1875rem'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.875rem',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  },
  infoSeat: {
    textAlign: 'right'
  },
  h2: {
    margin: '0.1875rem 0 0',
    fontSize: '1rem',
    fontWeight: 'normal',
    color: COLORS.textDark,
    textTransform: 'none'
  },
  flightInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  },
  bottom: {
    borderRadius: '0 0 0.625rem 0.625rem',
    backgroundColor: COLORS.white
  },
  bottomInfo: {
    padding: '1.25rem 2.1875rem'
  },
  depart: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    textTransform: 'uppercase'
  },
  barcode: {
    width: '100%',
    height: '2.8125rem',
    background: `linear-gradient(to right, 
      #000 0%, #000 2%, #fff 2%, #fff 3%,
      #000 3%, #000 4%, #fff 4%, #fff 6%,
      #000 6%, #000 9%, #fff 9%, #fff 10%,
      #000 10%, #000 11%, #fff 11%, #fff 12%,
      #000 12%, #000 13%, #fff 13%, #fff 16%,
      #000 16%, #000 18%, #fff 18%, #fff 19%,
      #000 19%, #000 20%, #fff 20%, #fff 21%,
      #000 21%, #000 25%, #fff 25%, #fff 26%,
      #000 26%, #000 27%, #fff 27%, #fff 29%,
      #000 29%, #000 30%, #fff 30%, #fff 33%,
      #000 33%, #000 36%, #fff 36%, #fff 37%,
      #000 37%, #000 38%, #fff 38%, #fff 40%,
      #000 40%, #000 43%, #fff 43%, #fff 44%,
      #000 44%, #000 45%, #fff 45%, #fff 46%,
      #000 46%, #000 47%, #fff 47%, #fff 50%,
      #000 50%, #000 52%, #fff 52%, #fff 53%,
      #000 53%, #000 56%, #fff 56%, #fff 57%,
      #000 57%, #000 58%, #fff 58%, #fff 59%,
      #000 59%, #000 62%, #fff 62%, #fff 64%,
      #000 64%, #000 65%, #fff 65%, #fff 67%,
      #000 67%, #000 68%, #fff 68%, #fff 69%,
      #000 69%, #000 70%, #fff 70%, #fff 73%,
      #000 73%, #000 76%, #fff 76%, #fff 77%,
      #000 77%, #000 78%, #fff 78%, #fff 81%,
      #000 81%, #000 83%, #fff 83%, #fff 84%,
      #000 84%, #000 87%, #fff 87%, #fff 88%,
      #000 88%, #000 89%, #fff 89%, #fff 90%,
      #000 90%, #000 93%, #fff 93%, #fff 96%,
      #000 96%, #000 98%, #fff 98%, #fff 100%)`
  }
};

// Sub-components
const InfoField = ({ label, value, style }) => (
  <div style={style}>
    {label}
    <h2 style={styles.h2}>{value}</h2>
  </div>
);

const LocationDisplay = ({ city, code, time }) => (
  <div style={styles.location}>
    {city}
    <h1 style={styles.cityCode}>{code}</h1>
    {time}
  </div>
);

const Arrow = () => (
  <div style={styles.location}>
    <div style={styles.arrow.container}>
      <div style={styles.arrow.part(45, '0.75rem -0.3125rem')}></div>
      <div style={styles.arrow.part(-45, '0.75rem 0.4375rem')}></div>
    </div>
  </div>
);

// Main component
const BoardingPass = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@600;700&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fontTimer = setTimeout(() => setFontLoaded(true), 1000);
    const timeTimer = setInterval(() => setCurrentDate(new Date()), 1000);

    return () => {
      clearTimeout(fontTimer);
      clearInterval(timeTimer);
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  const arrivalTime = addMinutes(currentDate, FLIGHT_DATA.flightDuration);
  const boardingTime = addMinutes(currentDate, FLIGHT_DATA.boardingTime);

  return (
    <div style={styles.container}>
      <div style={styles.ticket}>
        <div style={styles.header}>
          <div style={styles.logo(fontLoaded)}>{FLIGHT_DATA.airline}</div>
          <div style={styles.flightLabel}>Boarding Pass</div>
        </div>

        <div style={styles.body}>
          <div style={styles.notch('left')}></div>
          <div style={styles.notch('right')}></div>

          <div style={styles.locations}>
            <LocationDisplay 
              city={FLIGHT_DATA.origin.city}
              code={FLIGHT_DATA.origin.code}
              time={formatTime(currentDate)}
            />
            <Arrow />
            <LocationDisplay 
              city={FLIGHT_DATA.destination.city}
              code={FLIGHT_DATA.destination.code}
              time={formatTime(arrivalTime)}
            />
          </div>

          <div style={styles.bodyInfo}>
            <div style={styles.info}>
              <InfoField label="Passenger" value={FLIGHT_DATA.passenger} />
              <InfoField label="Seat" value={FLIGHT_DATA.seat} style={styles.infoSeat} />
            </div>

            <div style={styles.flightInfo}>
              <InfoField label="Flight" value={FLIGHT_DATA.flightNumber} />
              <InfoField label="Date" value={formatDate(currentDate)} />
              <InfoField label="Depart" value={formatTime(currentDate)} />
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.bottomInfo}>
            <div style={styles.depart}>
              <InfoField label="Terminal" value={FLIGHT_DATA.terminal} />
              <InfoField label="Gate" value={FLIGHT_DATA.gate} />
              <InfoField label="Boarding" value={formatTime(boardingTime)} />
            </div>

            <div style={styles.barcode}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPass;
