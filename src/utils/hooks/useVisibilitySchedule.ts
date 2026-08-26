import { useEffect, useState } from 'react';

const VISIBILITY_SCHEDULE = {
  SHOW_DELAY: 2500,
  HIDE_DELAY: 6500,
  REPEAT_INTERVAL: 11000,
} as const;

export function useVisibilitySchedule(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const tick = () => {
      showTimer = setTimeout(() => setVisible(true), VISIBILITY_SCHEDULE.SHOW_DELAY);
      hideTimer = setTimeout(() => setVisible(false), VISIBILITY_SCHEDULE.HIDE_DELAY);
    };

    tick();
    const interval = setInterval(tick, VISIBILITY_SCHEDULE.REPEAT_INTERVAL);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  return visible;
}

export default useVisibilitySchedule;
