import React from 'react';
import TopNav from './components/TopNav';
import styles from './WordPages.module.css';
import Footer from './components/Footer';
import Post from './blog/first-post.mdx';



function About() {
  return (
    <div className="container">
      <TopNav />
      <div className="centeredContent">
        <h1>LOGBOOK</h1>
        <p>  <Post />     </p>
      </div>
 <Footer />
    </div>
  );
}

export default About;