import React, { useEffect } from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import './WordPages.css';
import instaImg from './assets/insta.png';
import elonImg from './assets/x.png';
import fbookImg from './assets/fbook.png';

function Contact() {
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'auto';
      root.style.height = 'auto';
    }
  }, []);

  return (
    <>
      <style>{`
        body, #root {
          overflow: auto !important;
          height: auto !important;
          min-height: 100vh !important;
        }
      `}</style>
      <div className="container" style={{ overflow: 'auto', minHeight: '100vh', height: 'auto' }}>
        <TopNav />

      <main className="centeredContent">
        <h1>CONTACT</h1>

        <span className="hat">Follow on Social</span>
        <div className="social-links">
          <a
            href="https://www.instagram.com/cubist_heart_labs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src={instaImg}
              alt="Instagram"
              className="social-icon"
            />
          </a>
          <a
            href="https://x.com/cubistheartlabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src={elonImg}
              alt="X (Twitter)"
              className="social-icon"
            />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100090369371981"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src={fbookImg}
              alt="X (Twitter)"
              className="social-icon"
            />
          </a>
        </div>

        <span className="hat">Get the Lab's Monthly Newsletter</span>
        <p>
          <span className="smallcaps">Subscribe</span> to receive the lab's
          monthly newsletter.
          <br />
          We will never sell or release your email address.
        </p>
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/borrowed"
          method="post"
          target="popupwindow"
          className="embeddable-buttondown-form"
        >
          <input
            type="email"
            name="email"
            id="bd-email"
            placeholder="you@example.com"
            required
          />
          <input type="submit" value="Subscribe" />
        </form>
        {/* </section> */}

        {/* Email contact form */}
        <section className="section">
          <span className="hat">Send a Message to the Lab</span>
          <p>
            <span className="smallcaps">Questions?</span> Comments? Suggestions?
          </p>
          <form
            action="https://formspree.io/f/xnjobvva"
            method="POST"
            className="contact-form"
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
            />
            <textarea
              name="message"
              placeholder="Your message..."
              rows="5"
              required
            />
            <input type="submit" value="Send Message" />
          </form>
          <p className="email-fallback">
            Or email directly:{' '}
            <a
              className="email-link"
              href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭"
            >
              cubistheart@gmail.com
            </a>
          </p>
        </section>
      </main>

      <Footer />
      </div>
    </>
  );
}

export default Contact;
