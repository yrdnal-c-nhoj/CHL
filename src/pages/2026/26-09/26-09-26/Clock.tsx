import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';

export const assets: string[] = [];

const Clock_26_09_26 = () => {
  const time = useSmoothClock(16);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {time.toLocaleTimeString()}
      </div>
    </main>
  );
};

Clock_26_09_26.displayName = 'Clock_26_09_26';

export default Clock_26_09_26;
