import React, { FC } from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';
import fbookImg from '@/assets/icons/fbook.png';
import styles from './Contact.module.css';

const Contact: FC = () => {
  return (
    <div className="word-page-container">
      <TopNav />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>
          CONTACT
        </h1>
        
        <hr className={styles.divider} />
        
        <span className={styles.hat}>Follow on Social</span>
        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com/cubist_heart_labs/" target="_blank" rel="noopener noreferrer">
            <img src={instaImg} alt="Instagram" className={styles.socialIcon} />
          </a>
          <a href="https://x.com/cubistheartlabs" target="_blank" rel="noopener noreferrer">
            <img src={elonImg} alt="X (Twitter)" className={styles.socialIcon} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100090369371981" target="_blank" rel="noopener noreferrer">
            <img src={fbookImg} alt="Facebook" className={styles.socialIcon} />
          </a>
        </div>

        <hr className={styles.divider} />
        
        <section className="w-full">
          <span className={styles.hat}>Get the Lab's Monthly Newsletter</span>
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-center">
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">Subscribe</span> to receive the lab's monthly newsletter.
            <br />
            We will never sell or release your email address.
          </p>
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/borrowed"
            method="post"
            target="popupwindow"
            className="flex flex-col w-full gap-2 mt-2"
          >
            <input type="email" name="email" id="bd-email" placeholder="you@example.com" className={styles.input} required />
            <input type="submit" value="Subscribe" className={`${styles.button} rounded py-3 px-6 cursor-pointer border-none w-auto self-center`} />
          </form>
        </section>

        <section className="w-full mt-4">
          <hr className={styles.divider} />
          <span className={styles.hat}>Send a Message to the Lab</span>
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-center">
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">Questions?</span> Comments? Suggestions?
          </p>
          <form action="https://formspree.io/f/xnjobvva" method="POST" className="flex flex-col w-full gap-3 mt-4">
            <input type="text" name="name" placeholder="Your name" className={styles.input} required />
            <input type="email" name="email" placeholder="your@email.com" className={styles.input} required />
            <textarea name="message" placeholder="Your message..." rows={5} className={`${styles.input} resize-y min-h-[120px]`} required />
            <input type="submit" value="Send Message" className={`${styles.button} rounded py-3 px-6 cursor-pointer border-none w-auto self-center`} />
          </form>
          
          <p className="mt-4 text-[0.85rem] text-[#666] font-manrope text-center">
            Or email directly:{' '}
            <a className="font-bold no-underline text-lab-blue-deep hover:underline" href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭">
              cubistheart@gmail.com
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;