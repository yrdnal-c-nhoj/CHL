import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useEffect } from 'react';
import styles from './Clock.module.css';

const Clock_26_10_15 = () => {
  const time = useClock();

  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap';

    document.head.append(preconnect, stylesheet);
    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {time.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })}
      </div>
    </main>
  );
};

Clock_26_10_15.displayName = 'Clock_26_10_15';

export default Clock_26_10_15;
