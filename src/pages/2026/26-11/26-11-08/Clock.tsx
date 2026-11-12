import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import tileImage from '@/assets/images/26_images/26-11/26-11-08/forms.webp';
import backgroundTile from '@/assets/images/26_images/26-11/26-11-08/uniqueforms.webp';

import styles from './Clock.module.css';

export const assets = [tileImage, backgroundTile];

const Clock_26_11_08 = () => {
  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const hourAngle = (hours + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  return (
    <main
      className={styles.container}
      style={
        {
          '--background-tile': `url(${backgroundTile})`,
          '--hand-color': '#422e02',
          '--hand-color-end': '#49333300',
          '--hand-shadow': 'rgb(255, 255, 255)',
        } as React.CSSProperties
      }
    >
      <img
        src={tileImage}
        alt=""
        aria-hidden="true"
        className={styles.centerImage}
      />
      <div
        className={styles.hand}
        style={
          { '--angle': `${hourAngle}deg` } as React.CSSProperties &
            Record<string, string>
        }
      />
      <div
        className={styles.minuteHand}
        style={
          { '--angle': `${minuteAngle}deg` } as React.CSSProperties &
            Record<string, string>
        }
      />
      <div
        className={styles.secondHand}
        style={
          { '--angle': `${secondAngle}deg` } as React.CSSProperties &
            Record<string, string>
        }
      />
      <SRTime time={time} />
    </main>
  );
};

Clock_26_11_08.displayName = 'Clock_26_11_08';
export default Clock_26_11_08;
