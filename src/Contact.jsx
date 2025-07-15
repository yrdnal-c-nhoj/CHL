import React from 'react';
import TopNav from './components/TopNav';
import './Wordpages.css';



function Contact() {
 return (
    <div className="container">
      <TopNav />
      <div className="centeredContent">
        <h1>CONTACT</h1>

        {/* Manifesto Sections */}
        <div className="manifestoSection">
          <p><span className="hat">We Take Pictures</span><br />
          <span className="smallcaps">WE APPROPRIATE BEAUTIFUL</span> images, scavenged from the infinite scroll of the Internet. Pictures isolate time. They make now into something permanent and forever. We remix them.
          <span className="line">We are not thieves; we are alchemists.</span></p>

          <p><span className="hat">We Love Typefaces</span><br />
           <span className="smallcaps">BORN FROM LOVE</span> and shared like a secret handshake. Each contains the urgency to communicate information as well as the need to create, as unique as the maker's fingerprint. 
           <span className="line">Across the page the symbols move.</span></p>

          <p><span className="hat">We Are Open-Source Code</span><br />
          <span className="smallcaps">WE EMPLOY SCRIPTS,</span> tools, libraries, and frameworks built by countless hands all around the world. It is history's most successful group project.
          We copy and we clone and we fork and we install with joy and with gratitude in our cubist hearts.                    
          <span className="line">We code on the shoulders of giants.</span></p>

          <p><span className="hat">We Believe in Electrons</span><br />
          <span className="smallcaps">INVISIBLE, ENDLESSLY JUMPING.</span> They subatomically convey all our ambitions, thoughts, emotions and knowledge. Our nevous system.
           <span className="line">We use the unseen to render the intangible.</span></p>

          <p><span className="hat">"Plus Ars Citius Omni Tempore Nam Quisque"*</span><br />
          <span className="smallcaps">WE HONOR</span> and thank the artists, photographers, typographers and programmers, our collaborators everywhere whose work is now part of Cubist Heart Laboratories.
           <span className="line">&nbsp;</span>
           <span className="translate">*"More Art Faster For Everybody All The Time"</span></p>
        </div>
        <footer className="footer">
          ©{new Date().getFullYear()} Cubist Heart Laboratories. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Contact;