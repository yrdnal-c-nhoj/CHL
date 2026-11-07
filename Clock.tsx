import React from 'react';
import { useClock } from '../../utils/hooks/useClock';
import './Clock.css';

const AnalogClock: React.FC = () => {
  const currentTime = useClock();
  const hours = currentTime.getHours() % 12 || 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  return (
    <div className="analog-clock">
      <div className="clock-face">
        <div className="hand hour-hand" style={{ transform: `rotate(${(hours * 30) + (minutes * 0.5)}deg)` }}></div>
        <div className="hand minute-hand" style={{ transform: `rotate(${minutes * 6}deg)` }}></div>
        <div className="hand second-hand" style={{ transform: `rotate(${seconds * 6}deg)` }}></div>
      </div>
    </div>
  );
};

export default AnalogClock;
