import { useEffect, useState } from "react";

const clockStyles = `
  .clock-field {
    position: relative;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    background: #000;
    color: #fff;
  }
  .clock-desktop {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 100%;
  }
  .clock-mobile {
    display: none;
  }
  .clock-lane {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .clock-track {
    display: flex;
    flex-shrink: 0;
    width: max-content;
    animation: clock-left 40s linear infinite;
    will-change: transform;
  }
  .clock-group {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0.5rem;
    padding-right: 0.5rem;
  }
  .clock-digits {
    display: flex;
    flex-shrink: 0;
    gap: 0.15rem;
  }
  .clock-digit {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 0.72em;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #171717;
    color: #fff;
    font-family: monospace;
    font-size: clamp(1.5rem, 5vw, 4rem);
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1;
  }
  @keyframes clock-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (max-width: 640px) {
    .clock-desktop { display: none; }
    .clock-mobile {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .clock-mobile .clock-lane {
      align-items: stretch;
    }
    .clock-mobile .clock-track {
      flex-direction: column;
      width: 100%;
      height: max-content;
      animation: clock-up 35s linear infinite;
    }
    .clock-mobile .clock-group {
      flex-direction: column;
      width: 100%;
      padding-right: 0;
      padding-bottom: 0.5rem;
    }
    .clock-mobile .clock-digits {
      gap: 0.1rem;
    }
    .clock-mobile .clock-digit {
      font-size: clamp(1.2rem, 7vw, 2.5rem);
    }
  }
  @keyframes clock-up {
    from { transform: translateY(0); }
    to { transform: translateY(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .clock-track { animation-duration: 120s; }
  }
`;

function getTime() {
  const now = new Date();
  return (
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0")
  );
}

function useMinuteClock() {
  const [time, setTime] = useState(getTime);
  useEffect(() => {
    let timeout: number;
    let interval: number;
    const delay = 60_000 - (Date.now() % 60_000);
    timeout = window.setTimeout(() => {
      setTime(getTime());
      interval = window.setInterval(() => {
        setTime(getTime());
      }, 60_000);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);
  return time;
}

function Digits({ time }: { time: string }) {
  return (
    <div className="clock-digits">
      {time.split("").map((digit, index) => (
        <span className="clock-digit" key={index}>
          {digit}
        </span>
      ))}
    </div>
  );
}

function Track({ time }: { time: string }) {
  // 24 copies → one group is almost always wider/taller than the viewport
  // (covers ultrawide monitors and tall phones). Two groups + -50% = seamless forever.
  const COPIES = 24;

  return (
    <div className="clock-track">
      {[0, 1].map((copy) => (
        <div className="clock-group" key={copy}>
          {Array.from({ length: COPIES }, (_, index) => (
            <Digits time={time} key={index} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function DigitalClock() {
  const time = useMinuteClock();
  return (
    <>
      <style>{clockStyles}</style>
      <main className="clock-field">
        <div className="clock-desktop">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="clock-lane" key={index}>
              <Track time={time} />
            </div>
          ))}
        </div>
        <div className="clock-mobile">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="clock-lane" key={index}>
              <Track time={time} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}