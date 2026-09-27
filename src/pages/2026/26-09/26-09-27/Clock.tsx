import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import fontUrl from '@/assets/fonts/26fonts/26-09-26x.ttf?url';
import styles from './Clock.module.css';

export const assets = [fontUrl];

const FONT_FAMILY = 'ClockFont_26_09_26';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

type Axis = 'x' | 'y' | 'z' | 'xyz';

const getAnimationName = (axis: Axis): string => {
  if (axis === 'x') return styles.spinX ?? '';
  if (axis === 'y') return styles.spinY ?? '';
  if (axis === 'z') return styles.spinZ ?? '';
  return styles.spinXYZ ?? '';
};

const formatDigit = (value: string | undefined): string => {
  const digit = value ?? '0';
  return digit === '0' ? 'O' : digit;
};

interface DigitProps {
  value: string;
  axis: Axis;
}

const Digit = ({ value, axis }: DigitProps) => {
  return (
    <div className={styles.digit}>
      <span
        className={styles.digitInner}
        style={{ animationName: getAnimationName(axis) }}
      >
        {value}
      </span>
    </div>
  );
};

const Clock = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <main className={styles.container}>
      <div className={styles.digitalDisplay}>
        <div className={styles.hoursGroup}>
          <Digit value={formatDigit(hours[0])} axis="z" />
          <Digit value={formatDigit(hours[1])} axis="y" />
        </div>

        <div className={styles.minutesGroup}>
          <Digit value={formatDigit(minutes[0])} axis="x" />
          <Digit value={formatDigit(minutes[1])} axis="xyz" />
        </div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock.displayName = 'Clock_26_09_26';

export default Clock;
