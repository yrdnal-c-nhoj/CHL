import React from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import './WordPages.css';
import instaImg from './assets/i.png';
import elonImg from './assets/x.png';

function Contact() {
  return (
    <div className="container">
      <TopNav />

      <main className="centeredContent">
        <h1>CONTACT</h1>

          <span className="hat">Follow on Social</span>
          <div className="social-links">
            <a href="https://www.instagram.com/cubist_heart_labs/" target="_blank" rel="noopener noreferrer">
              <img src={instaImg} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://x.com/cubistheartlabs" target="_blank" rel="noopener noreferrer">
              <img src={elonImg} alt="X (Twitter)" className="social-icon" />
            </a>
          </div>
 
          <span className="hat">Get the Lab's Monthly Newsletter</span>
          <p>
           
            <span className="smallcaps">Subscribe</span>  to receive the lab's monthly newsletter. 
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

        {/* Email contact */}
        <section className="section">
          <span className="hat">Send an eMail to the Lab</span>
           <p><span className="smallcaps">Questions?</span>  Comments? Suggestions?</p>
          <p>Send to:
          <a className="email-link" href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭">
            cubistheart@gmail.com
          </a></p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;