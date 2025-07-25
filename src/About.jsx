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
        <p>
        BorrowedTime is a new clock each day, using found images from the Internet. 
        </p><p>It is made with VSCode using React JavaScript, housed on Github and deployed on Vercel.</p>
          <p>Previously this was an HTMl based site. Some of the clocks have not yet beem converted successfully to Java Script and can be found here on the old site.
        We know that you depend on Cubist Heart Laboratories for your varied timekeeping needs. Whether you are launching spacecraft, splitting atoms, or timing delivery room contractions, we are here to help.
        </p>
      </div>
 <Footer />
    </div>
  );
}

export default About;