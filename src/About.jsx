import React from 'react';
import TopNav from './components/TopNav';
import './About.css';

function About() {
  return (
    <div className="container">
      <TopNav />
      <div className="centeredContent">
        <h1>About</h1>
        <p>
          Welcome to Cubist Heart Laboratories, where we explore the intersection of art, technology, and time through our daily computational clock creations. 
          BorrowedTime is a project dedicated to crafting unique, algorithmically generated clocks that challenge conventional perceptions of timekeeping. 
          Each day, we release a new clock, blending innovative design with computational precision.
        </p>
        <p>
          Our mission is to push the boundaries of digital art and provide a platform for creativity that evolves with each passing moment. 
          Join us on this journey as we redefine time, one clock at a time.
        </p>
      </div>
      <footer className="footer">
        *More Art Faster All The Time For Everybody<br />
        ©{new Date().getFullYear()} Cubist Heart Laboratories. All rights reserved.
      </footer>
    </div>
  );
}

export default About;