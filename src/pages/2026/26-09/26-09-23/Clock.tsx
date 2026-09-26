import { useClock } from "@/utils/hooks";
import SRTime from "@/components/SRTime";
import styles from "./Clock.module.css";

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
  const time = useClock();
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <main className={styles.container}>
      <div className={styles.quoteWrapper}>
        <blockquote className={styles.quote}>{QUOTE}</blockquote>
        <footer className={styles.quoteAttribution}>
          <cite>— japanese proverb</cite>
        </footer>
      </div>

      <div className={styles.digitalDisplay} aria-hidden="true">
        *{hours}:{minutes}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock.displayName = "Clock_26_09_23";
export default Clock;