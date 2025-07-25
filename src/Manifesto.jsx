import React from 'react';
import TopNav from './components/TopNav';
import './WordPages.css';
import Footer from './components/Footer';

function Manifesto() {
  return (
    <div className="container">
      <TopNav />
      <div className="centeredContent">
        <h1>MANIFESTO</h1>

        {/* Epigraphs */}
        <div className="epigraph">
          <div className="quote">“Time and Space died yesterday.”</div>
          <div className="attribution">
            <span className="author">— F.T. Marinetti</span>, 
            <span className="source"><cite> The Futurist Manifesto</cite></span>
          </div>
        </div>

        <div className="epigraph">
          <div className="quote">“Nature is too green, and badly lit.”</div>
          <div className="attribution">
            <span className="author">— François Boucher</span>, 
            <span className="source"><cite> Boucher et la peinture sous Louis XV</cite></span>
          </div>
        </div>

        {/* Manifesto Sections */}
        <div className="manifestoSection">
          <p><span className="hat">We Take Pictures<br />&nbsp;</span><br />
          <span className="smallcaps">WE APPROPRIATE BEAUTIFUL</span> images, scavenged from the infinite scroll of the Internet. Pictures distort time. We catch themas they swim by and remix them.
          <span className="line">We are not thieves; we are alchemists.<br />&nbsp;</span></p>

          <p><span className="hat">We Love Typefaces<br />&nbsp;</span><br />
           <span className="smallcaps">BORN FROM PASSION</span> and shared like a secret handshake. Each contains the urgency to communicate information as well as the need to create, as unique as the maker's fingerprint. 
           <span className="line">Across the page the symbols move.<br />&nbsp;</span></p>

          <p><span className="hat">We Use Open-Source Code<br />&nbsp;</span><br />
          <span className="smallcaps">WE EMPLOY SCRIPTS,</span> tools, libraries, and frameworks built by countless hands all around the world. It is history's most successful group project.
          We copy and we clone and we fork and we install with joy and with gratitude in our cubist hearts.                    
          <span className="line">We code on the shoulders of giants.<br />&nbsp;</span></p>

          <p><span className="hat">We Believe in Electrons<br />&nbsp;</span><br />
          <span className="smallcaps">INVISIBLE, ENDLESSLY JUMPING. </span>  Like us, they occupy a place at the blurry and busy intersection of Nature, Culture and Technology. They subatomically convey all our ambitions, dreams, thoughts, emotions and knowledge. 
           <span className="line">We use the unseen to render the intangible.<br />&nbsp;</span></p>



          <p><span className="hat">We Use AI<br />&nbsp;</span><br />
          <span className="smallcaps">A NEW TOOL </span> that helps us to make new things and to learn new things and to write manifestos.
           <span className="line">We move forward without fear.<br />&nbsp;</span></p>

       

          <p><span className="hat">Plus Ars Citius Omni Tempore Nam Quisque*<br />&nbsp;</span><br />
          <span className="smallcaps">WE HONOR AND THANK</span> our collaborators everywhere.<br />&nbsp;
           <span className="line">&nbsp;</span>
           <span className="translate">*"More Art Faster For Everybody All The Time"</span></p>
        </div>
     
      </div>
        <Footer />
    </div>
  );
}

export default Manifesto;