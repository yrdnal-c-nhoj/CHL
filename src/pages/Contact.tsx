import fbookImg from '@/assets/icons/fbook.png';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';
import type { FC } from 'react';
import Footer from '../components/Footer';
import TopNav from '../components/TopNav';
import styles from '../styles/Contact.module.css';

const Contact: FC = () => {
  return (
    <div className="word-page-container">
      <TopNav />

      <main className={styles.mainContent}>
        <span className={styles.hat}>Follow on Social</span>
        <div className={styles.socialLinks}>
          <a
            href="https://x.com/CubistL91804"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={elonImg}
              alt="X (Twitter)"
              className={styles.contactSocialIcon}
            />
          </a>
          <a
            href="https://www.instagram.com/cubist_heart_labs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={instaImg}
              alt="Instagram"
              className={styles.contactSocialIcon}
            />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100090369371981"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={fbookImg}
              alt="Facebook"
              className={styles.contactSocialIcon}
            />
          </a>
        </div>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <span className={styles.hat}>Get the Lab's Monthly Newsletter</span>
          <p className={styles.content}>
            <span className={styles.label}>Subscribe to receive </span> the
            lab's monthly newsletter.
            <br />
            We will never sell or release your email address.
          </p>
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/borrowed"
            method="post"
            target="popupwindow"
            className={styles.form}
          >
            <input
              type="email"
              name="email"
              id="bd-email"
              placeholder="you@example.com"
              className={styles.input}
              required
            />
            <input type="submit" value="Subscribe" className={styles.button} />
          </form>
          <hr className={styles.divider} />
        </section>

        <section className={styles.section}>
          <span className={styles.hat}>Send a Message to the Lab</span>
          <p className={styles.content}>
            <span className={styles.label}>
              Questions? Comments? Suggestions?
            </span>{' '}
          </p>
          <form
            action="https://formspree.io/f/xnjobvva"
            method="POST"
            className={styles.formMessage}
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className={styles.input}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className={styles.input}
              required
            />
            <textarea
              name="message"
              placeholder="Your message..."
              rows={5}
              className={`${styles.input} ${styles.textarea}`}
              required
            />
            <input
              type="submit"
              value="Send Message"
              className={styles.button}
            />
          </form>
          <p className={styles.contentSmall}>
            Or email directly:{' '}
            <a
              className={styles.emailLink}
              href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭"
            >
              cubistheart@gmail.com
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
