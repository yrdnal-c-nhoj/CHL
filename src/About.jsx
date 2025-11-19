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

        {/* <div className="epigraph">
          <div className="quote">
            “Our heads are round so our thoughts can change direction.”
          </div>
          <div className="attribution">
            <span className="author">— Francis Picabia</span>
          </div>
        </div> */}

        <section className="manifestoSection">
          
          <p>
            <span className="hat">About BorrowedTime<br />&nbsp;</span>
                  <span className="smallcaps">a project by  </span>Cubist Heart Laboratories, BorrowedTime is
             new clock each day, using found images from the Internet.
          It is made with VSCode using React JavaScript, housed on Github and deployed on Vercel.
          </p>

         

          {/* <p>
           Whether you are launching spacecraft, splitting atoms, or timing delivery room contractions, we are your source for computationally intensive timekeeping devices.

   </p> */}
   
   {/* 
          <p>
          Previously this was an HTML-based website. You can see it<a href="https://the-clocks.github.io/Borrowed-Time/" target="_blank" rel="noopener noreferrer">here.</a>
          </p> */}

       
<br />
          <p>
            <span className="hat">About Cubist Heart Laboratories<br />&nbsp;</span>
                      <span className="smallcaps">Cubist Heart Laboratories </span>
 is a global collective of scientists, artists and shamans found wherever electrons move.
                 </p><br /><br />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default About;