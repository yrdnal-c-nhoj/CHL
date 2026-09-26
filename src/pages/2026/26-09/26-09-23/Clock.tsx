import { useEffect } from "react";
import { useClock } from "@/utils/hooks";
import SRTime from "@/components/SRTime";
import styles from "./Clock.module.css";
import clockFont from "@/assets/fonts/26fonts/26-09-23.ttf?url";

export const assets = [clockFont];

const QUOTE = (
  <>
    Time spent laughing
    <br />
    is time spent
    <br />
    with the gods.
  </>
);

const Clock = () => {
  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=GFS+Didot&family=Montserrat&display=swap';

    document.head.append(preconnect, stylesheet);
    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  const time = useClock();
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <main className={styles.container}>
      <div className={styles.quoteWrapper}>
        <blockquote className={styles.quote}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>
          {QUOTE}
          <span className={styles.quoteMark} aria-hidden="true">
            &rdquo;
          </span>
          <span className={styles.quoteStar} aria-hidden="true">
            *
          </span>
        </blockquote>
        <footer className={styles.quoteAttribution}>
          <cite>— japanese proverb</cite>
        </footer>
      </div>

      <div className={styles.digitalDisplay} aria-hidden="true">
        <span className={styles.clockStar}>*</span>
        {hours}<span className={styles.colon}>:</span>{minutes}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock.displayName = "Clock_26_09_23";
export default Clock;
