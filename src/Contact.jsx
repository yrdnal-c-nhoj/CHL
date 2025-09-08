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

      <div className="centeredContent">
        <h1>CONTACT</h1>
         <br /> 

        <section className="manifestoSection">
          {/* Instagram */}
         {/* Instagram + X side by side */}
<div className="section">
  <span className="hat">Follow on Social</span>

  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    <a
      href="https://www.instagram.com/cubist_heart/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={instaImg}
        alt="Cubist Heart Instagram preview"
        className="instaImg"
        style={{ width: "2rem", height: "2rem" }}
      />
    </a>

    <a
      href="https://x.com/cubistheartlabs"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={elonImg}
        alt="Cubist Heart X preview"
        className="elonImg"
        style={{ width: "2rem", height: "2rem" }}
      />
    </a>
  </div>

  <br /> <br />
</div>


          {/* Newsletter */}
          <div className="section">
            <span className="hat">Get the Lab's Monthly Newsletter</span>
            <p>
              <span className="smallcaps">Subscribe to receive</span> the lab's monthly newsletter containing clock notes,
              dispatches, research findings, recipes, pictures of houseplants, and exclusive links to original downloadable art.
              <br />
              We will never sell or release your email address.
            </p>

            <form
              action="https://buttondown.email/api/emails/embed-subscribe/borrowed"
              method="post"
              target="popupwindow"
              className="embeddable-buttondown-form"
            >
              <label htmlFor="bd-email">Email:</label>
              <input
                type="email"
                name="email"
                id="bd-email"
                placeholder="you@example.com"
                required
              />
              <input type="submit" value="Subscribe" />
            </form>
             <br /> <br />
          </div>

          {/* Email contact */}
          <div className="section">
            <span className="hat">Send an eMail to the Lab</span>
            <p>
              <span className="smallcaps">Questions? Comments? Suggestions?</span> Complaints? Requests? Pleas for help?
            </p>
            <a className="email-link" href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭">
              cubistheart@gmail.com
            </a>
            <p>We love email! We will respond as soon as we can.</p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;
