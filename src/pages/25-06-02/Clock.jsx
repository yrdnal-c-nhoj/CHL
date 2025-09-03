import { useEffect } from 'react';

export default function Clock() {
  useEffect(() => {
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    function updateClock() {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

      const secondsDeg = seconds * 6 - 90;
      const minutesDeg = minutes * 6 - 90;
      const hoursDeg = hours * 30 - 90;

      secondHand.style.transform = `rotate(${secondsDeg}deg)`;
      minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
      hourHand.style.transform = `rotate(${hoursDeg}deg)`;

      requestAnimationFrame(updateClock);
    }

    updateClock();
  }, []);

  const numberPositions = {
    1: { top: '20%', left: '70%' },
    2: { top: '30%', left: '82%' },
    3: { top: '50%', left: '90%' },
    4: { top: '70%', left: '82%' },
    5: { top: '80%', left: '70%' },
    6: { top: '90%', left: '50%' },
    7: { top: '80%', left: '30%' },
    8: { top: '70%', left: '18%' },
    9: { top: '50%', left: '10%' },
    10: { top: '30%', left: '18%' },
    11: { top: '20%', left: '30%' },
    12: { top: '10%', left: '50%' },
  };

  const handStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: '0% 50%',
    filter: 'saturate(4.5) contrast(7.2)',
    zIndex: 18,
  };

  const assets = {
    parts1: new URL('./wwarnn.png', import.meta.url).href,
    parts2: new URL('./wwarnn.png', import.meta.url).href,
    meter: new URL('./wwz.gif', import.meta.url).href,
    meter2: new URL('./dash.webp', import.meta.url).href,
    meter3: new URL('./da.webp', import.meta.url).href,
    hand: new URL('./wzzz.png', import.meta.url).href,
    numbers: {
      1: new URL('./werer-ezgif.com-gif-maker.webp', import.meta.url).href,
      2: new URL('./Icons-03.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      3: new URL('./Icons-25.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      4: new URL('./IconsRED-11.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      5: new URL('./Icons-11.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      6: new URL('./Icons-14.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      7: new URL('./Icons-16.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      8: new URL('./Icons-24.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      9: new URL('./Icons-08.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      10: new URL('./Icons-27.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      11: new URL('./Icons-28.png-ezgif.com-gif-maker.webp', import.meta.url).href,
      12: new URL('./Icons-10.png-ezgif.com-gif-maker.webp', import.meta.url).href,
    },
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        height: '100dvh',
        background: 'grey',
        overflow: 'hidden',
      }}
    >
      <img src={assets.parts2} style={{ position: 'absolute', width: '100vw', height: '100vh', opacity: 0.3, left: '50%', transform: 'translateX(-50%) scaleX(-1)', zIndex: 0 }} alt="" />
      <img src={assets.parts1} style={{ position: 'absolute', width: '100vw', height: '100vh', opacity: 0.3, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} alt="" />
      <img src={assets.meter} style={{ position: 'absolute',  height: '50vh', top: '20vh', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }} alt="" />
      <img src={assets.meter3} style={{ position: 'absolute', height: '36vh', top: '29vh', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }} alt="" />
      <img src={assets.meter2} style={{ position: 'absolute', height: '50vh', top: '29vh', left: '50%', transform: 'translateX(-50%)', zIndex: 4 }} alt="" />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '90vh',
          height: '90vh',
          transform: 'translate(-50%, -50%)',
          zIndex: 8,
        }}
      >
        {Object.entries(numberPositions).map(([num, pos]) => (
          <img
            key={num}
            src={assets.numbers[num]}
            alt={`Number ${num}`}
            style={{
              position: 'absolute',
              width: '75px',
              height: '75px',
              transform: 'translate(-50%, -50%)',
              top: pos.top,
              left: pos.left,
            }}
          />
        ))}

        <img id="hour-hand" src={assets.hand} alt="Hour Hand" style={{ ...handStyle, width: '25%', height: '66px' }} />
        <img id="minute-hand" src={assets.hand} alt="Minute Hand" style={{ ...handStyle, width: '35%', height: '38px' }} />
        <img id="second-hand" src={assets.hand} alt="Second Hand" style={{ ...handStyle, width: '45%', height: '22px' }} />
      </div>
    </div>
  );
}
