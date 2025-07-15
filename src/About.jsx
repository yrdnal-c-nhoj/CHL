import React from 'react';
import TopNav from './components/TopNav';
import './Wordpages.css';
import Footer from './components/Footer';

function About() {
  return (
    <div className="container">
      <TopNav />
      <div className="centeredContent">
        <h1>ABOUT</h1>
        <p>
        BorrowedTime is a new clock each day, using images, typefaces and code snippets found on the Internet. 
        </p><p>It is built using React and JavaScript, housed on Github and deployed on Vercel.
        </p>
      </div>
 <Footer />
    </div>
  );
}

export default About;