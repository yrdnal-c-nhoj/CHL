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
        </p><p>It is made with VSCode using React JavaScript, housed on Github and deployed on Vercel.
          <br />https://github.com/yrdnal-c-nhoj/CHL
        </p>
      </div>
 <Footer />
    </div>
  );
}

export default About;