// src/Clock.jsx
import React, { useEffect, useState } from 'react';

const Clock = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: '2rem', textAlign: 'center', marginTop: '2rem' }}>
      {time.toLocaleTimeString()}
    </div>
  );
};

export default Clock;
