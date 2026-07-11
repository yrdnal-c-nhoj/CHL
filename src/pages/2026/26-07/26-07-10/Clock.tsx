/** @jsxImportSource react */
import { formatTime, useClockTime } from '@/utils/clockUtils';

export default function Clock() {
  const time = useClockTime();
  const timeString = formatTime(time, '24h');

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
      backgroundColor: '#111',
      color: '#eee',
      fontFamily: 'monospace',
      fontSize: '10rem'
    }}>
      {timeString}
    </div>
  );
}