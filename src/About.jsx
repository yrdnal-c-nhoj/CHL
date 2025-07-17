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
        </p><p>In our transition from HTML to the currernt It is built using React and JavaScript, housed on Github and deployed on Vercel.
        </p>
      </div>
 <Footer />
    </div>
  );
}

export default About;