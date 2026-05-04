import React from 'react';
import TopNav from './components/TopNav';
import './WordPages.css';
import Footer from './components/Footer';

const About: React.FC = () => {
  return (
    <div className="container">
      <TopNav />

      <div className="centeredContent">
        <h1>ABOUT</h1>
        <section className="manifestoSection">
          <p>
            <span className="hat">
              About BorrowedTime
              <br />
              &nbsp;
            </span>
            <span className="smallcaps">a project by </span>Cubist Heart
            Laboratories, BorrowedTime is new clock each day, using found images
            from the Internet. It is made with VSCode using React JavaScript,
            housed on Github and deployed on Vercel.
          </p>
          <br />
          <p>
              About Cubist Heart Laboratories
              <br />
              &nbsp;
            </span>
            <span className="smallcaps">Cubist Heart Laboratories </span>
            is a global collective of scientists, artists and shamans found
            wherever electrons move.
          </p>
          <br />
          <br />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default About;
