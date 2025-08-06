import React, { useEffect, useState } from 'react';
import styles from './Clock.module.css';
import clockFont from './sta.ttf'; // Required so Vite includes it in the build

const App = () => {
  const [time, setTime] = useState(getCurrentTime());

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.clock}>{time}</div>
      </main>
    </div>
  );
};

export default App;
