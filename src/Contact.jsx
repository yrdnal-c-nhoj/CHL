import React from 'react';
import TopNav from './components/TopNav';
import './WordPages.css';
// import ContactForm from './ContactForm';  
import Footer from './components/Footer';

function Contact() {
  return (
    <div className="container">
      <TopNav />
      <div className="centeredContent">
        <h1>CONTACT</h1>

        {/* Manifesto Sections */}
        <div className="manifestoSection">
          <p>
            <span className="hat">Get the Lab's Monthly Newsletter </span>
            <br />

            <span className="smallcaps">Subscribe to recieve</span> the lab's monthly newsletter containing clock notes, dispatches, research findings, recipes, pictures of houseplants and exclusive links to original downloadable art from the lab.<br /> We will never sell or release your eMail address.
          </p>

          <form
            action="https://buttondown.com/api/emails/embed-subscribe/borrowed"
            method="post"
            target="popupwindow"
            onSubmit={(e) => {
              window.open('https://buttondown.com/borrowed', 'popupwindow');
            }}
            className="embeddable-buttondown-form"
          >
            <label htmlFor="bd-email"></label>
            <input type="email" name="email" id="bd-email" required />
            <input type="submit" value="subscribe" />
          </form>
   



          <span className="hat">Send an eMail to the Lab<br />&nbsp;</span><br />
           <span className="smallcaps">Questions? Comments? Suggestions?</span> Complaints? Requests? Pleas for help? Fan mail? Cease-and-desist orders?
       



      
  <a class="email-link" href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭">
   cubistheart@gmail.com
  </a><br />

          {/* <ContactForm /> */}
&nbsp;
        
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
