import { useState, useEffect } from 'react';
import gridImage from './lan.gif';

// Counting rod digit map
const digitMap = {
  '0': '▫',
  '1': '\u{1D360}',
  '2': '\u{1D361}',
  '3': '\u{1D362}',
  '4': '\u{1D363}',
  '5': '\u{1D364}',
  '6': '\u{1D365}',
  '7': '\u{1D366}',
  '8': '\u{1D367}',
  '9': '\u{1D369}',
};

const toCountingRod = (number) =>
  String(number)
    .padStart(2, '0')
    .split('')
    .map((digit) => digitMap[digit]);

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [digitOpacities, setDigitOpacities] = useState({
    hours: [1, 1],
    minutes: [1, 1],
    seconds: [1, 1],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      const newHours = toCountingRod(newTime.getHours());
      const newMinutes = toCountingRod(newTime.getMinutes());
      const newSeconds = toCountingRod(newTime.getSeconds());
      const prevHours = toCountingRod(time.getHours());
      const prevMinutes = toCountingRod(time.getMinutes());
      const prevSeconds = toCountingRod(time.getSeconds());

      // Fade digits that changed
      setDigitOpacities({
        hours: prevHours.map((d, i) => (d !== newHours[i] ? 0 : 1)),
        minutes: prevMinutes.map((d, i) => (d !== newMinutes[i] ? 0 : 1)),
        seconds: prevSeconds.map((d, i) => (d !== newSeconds[i] ? 0 : 1)),
      });

      setTime(newTime);

      // Fade digits back in after transition
      setTimeout(() => {
        setDigitOpacities({
          hours: [1, 1],
          minutes: [1, 1],
          seconds: [1, 1],
        });
      }, 300);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const hours = toCountingRod(time.getHours());
  const minutes = toCountingRod(time.getMinutes());
  const seconds = toCountingRod(time.getSeconds());

  // Stable red background for all digits
  const digitBackgroundStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '12vw',
    height: '20vw',
    background: 'rgba(178,34,34,0.5)', // stable red
    boxShadow: '0 0 7vw #CB4F3FFF',
    margin: '-0.4vw',
  };

  const digitTextStyle = {
    fontSize: '20vw',
    fontFamily: "'KaiTi', 'STKaiti', serif",
    color: '#D1EEC9FF',
    textShadow: '2px 2px 0 #000000, -2px -2px 0 #000000',
    transition: 'opacity 0.3s ease',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        background: `
          radial-gradient(circle at 30% 20%, rgba(255,15,0,0.9) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(278,34,34,0.8) 0%, transparent 50%),
          linear-gradient(135deg, #8B1E00FF 0%, #E64106FF 50%, #CE0808FF 100%)
        `,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'KaiTi', 'STKaiti', serif",
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scaleX(-1)',
          width: '100vw',
          height: '120dvh',
          backgroundImage: `url(${gridImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      <div
        style={{
          display: 'flex',
          gap: '1vw',
          padding: '2vw',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 10,
          boxShadow: '0 0 5rem rgba(255,215,0,0.3)',
        }}
      >
        {hours.map((d, i) => (
          <div key={`h${i}`} style={digitBackgroundStyle}>
            <span style={{ ...digitTextStyle, opacity: digitOpacities.hours[i] }}>{d}</span>
          </div>
        ))}
        {minutes.map((d, i) => (
          <div key={`m${i}`} style={digitBackgroundStyle}>
            <span style={{ ...digitTextStyle, opacity: digitOpacities.minutes[i] }}>{d}</span>
          </div>
        ))}
        {seconds.map((d, i) => (
          <div key={`s${i}`} style={digitBackgroundStyle}>
            <span style={{ ...digitTextStyle, opacity: digitOpacities.seconds[i] }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;
