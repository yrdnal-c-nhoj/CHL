import React from 'react';
import TopNav from './components/TopNav';
import './WordPages.css';
import Footer from './components/Footer';

function About() {
  return (
    <div className="container">
      <TopNav />

      <div className="centeredContent">
        <h1>ABOUT</h1>

        <div className="epigraph">
          <div className="quote">
            “Our heads are round so our thoughts can change direction.”
          </div>
          <div className="attribution">
            <span className="author">— Francis Picabia</span>
          </div>
        </div>

        <section className="manifestoSection">
          <p>
            <span className="hat">About Borrowed Time</span>
            <p>&nbsp;</p> BorrowedTime is a new clock each day, using found images from the Internet.
          It is made with VSCode using React JavaScript, housed on Github and deployed on Vercel.
          </p>

          <p>
          Previously this was an HTML-based website. You can see it<a href="https://the-clocks.github.io/Borrowed-Time/" target="_blank" rel="noopener noreferrer">here.</a>
          </p>

         

          <p>
           Whether you are launching spacecraft, splitting atoms, or timing delivery room contractions, we are your source for computationally intensive timekeeping devices.
          </p>
<br />
          <p>
            <span className="hat">About Cubist Heart Laboratories</span>
            <p>&nbsp;</p> 
            A global collective of artists and scientists, Cubist Heart Laboratories is pushing the boundaries of computation and visual expression with genre-defying, boundary-breaking synergistically holistic projects involving emerging technologies.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default About;
