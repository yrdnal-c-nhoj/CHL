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

      

          <hr className={styles.divider} style={{ margin: '32px 0', border: 'none', borderTop: '2px solid #ccc' }} />
     
        <section className="w-full">
          <span className={styles.hat}>Get the Lab's Monthly Newsletter</span>
          <p className="mt-2 font-manrope text-[clamp(0.9rem,1.2vw,1.1rem)] text-left leading-relaxed">
            <span className="font-manrope font-bold text-[0.75rem] uppercase tracking-wider">
              Subscribe to receive </span>{' '}the lab's monthly newsletter.
            <br />
            We will never sell or release your email address.
          </p>
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/borrowed"
            method="post"
            target="popupwindow"
            className="flex flex-col w-full gap-2 mt-2"
          >
            <input
              type="email"
              name="email"
              id="bd-email"
              placeholder="you@example.com"
              className={styles.input}
              required
            />
            <input
              type="submit"
              value="Subscribe"
              className={`${styles.button} rounded py-3 px-6 cursor-pointer border-none w-40 h-12 self-start`}
            />
          </form>
          <hr className={styles.divider} style={{ margin: '32px 0', border: 'none', borderTop: '2px solid #ccc' }} />
        </section>

        <section className="w-full mt-0">
          <span className={styles.hat}>Send a Message to the Lab</span>
          <p className="mt-2 font-manrope text-[clamp(0.9rem,1.2vw,1.1rem)] text-lefy leading-relaxed">
            <span className="font-manrope font-bold text-[0.75rem] uppercase tracking-wider">
              Questions?
            
            Comments? Suggestions?</span>{' '}
          </p>
          <form
            action="https://formspree.io/f/xnjobvva"
            method="POST"
            className="flex flex-col w-full gap-3 mt-4"
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
              className={`${styles.input} resize-y min-h-[120px]`}
              required
            />
            <input
              type="submit"
              value="Send Message"
              className={`${styles.button} rounded py-3 px-6 cursor-pointer border-none w-40 h-12 self-start`}
            />
          </form>
          <p className="mt-4 font-manrope text-[#666] text-[0.85rem] text-left">
            Or email directly:{' '}
            <a
              className="font-bold no-underline text-lab-blue-deep hover:underline"
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