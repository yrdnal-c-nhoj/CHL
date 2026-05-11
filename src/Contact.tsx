import React, { FC } from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';
import fbookImg from '@/assets/icons/fbook.png';

const Contact: FC = () => {
  const inputStyles = "p-3 text-base font-manrope border border-[#ccc] rounded w-full box-border focus:outline-none focus:ring-1 focus:ring-lab-blue";
  const buttonStyles = "bg-[#6e6c6c] text-white font-bold font-manrope text-base border-none rounded py-3 px-6 cursor-pointer transition-colors duration-200 hover:bg-[#585656] w-auto self-center";
  const hatStyles = "font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block text-center";
  const dividerStyles = "border-none border-t border-lab-divider my-2 w-[300px]";

  return (
    <div className="word-page-container">
      <TopNav />

      <main className="flex flex-col items-center w-[90%] max-w-[60ch] z-10 text-[#060706] lg:w-[70%] lg:max-w-[70ch]">
        <h1 className="font-roboto text-lab-red tracking-widest text-[clamp(1.7rem,2vw,3rem)] text-center w-full my-2 leading-[1.4em]">
          CONTACT
        </h1>
        
        <hr className={dividerStyles} />
        
        <span className={hatStyles}>Follow on Social</span>
        <div className="flex items-center justify-center w-full gap-6 mt-8 mb-4">
          <a href="https://www.instagram.com/cubist_heart_labs/" target="_blank" rel="noopener noreferrer">
            <img src={instaImg} alt="Instagram" className="w-16 h-16 transition-opacity duration-200 hover:opacity-70" />
          </a>
          <a href="https://x.com/cubistheartlabs" target="_blank" rel="noopener noreferrer">
            <img src={elonImg} alt="X (Twitter)" className="w-16 h-16 transition-opacity duration-200 hover:opacity-70" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100090369371981" target="_blank" rel="noopener noreferrer">
            <img src={fbookImg} alt="Facebook" className="w-16 h-16 transition-opacity duration-200 hover:opacity-70" />
          </a>
        </div>

        <hr className={dividerStyles} />
        
        <section className="w-full">
          <span className={hatStyles}>Get the Lab's Monthly Newsletter</span>
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-center">
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">Subscribe</span> to receive the lab's monthly newsletter.
            <br />
            We will never sell or release your email address.
          </p>
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/borrowed"
            method="post"
            target="popupwindow"
            className="flex flex-col w-full gap-2 mt-2"
          >
            <input type="email" name="email" id="bd-email" placeholder="you@example.com" className={inputStyles} required />
            <input type="submit" value="Subscribe" className={buttonStyles} />
          </form>
        </section>

        <section className="w-full mt-4">
          <hr className={dividerStyles} />
          <span className={hatStyles}>Send a Message to the Lab</span>
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-center">
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">Questions?</span> Comments? Suggestions?
          </p>
          <form action="https://formspree.io/f/xnjobvva" method="POST" className="flex flex-col w-full gap-3 mt-4">
            <input type="text" name="name" placeholder="Your name" className={inputStyles} required />
            <input type="email" name="email" placeholder="your@email.com" className={inputStyles} required />
            <textarea name="message" placeholder="Your message..." rows={5} className={`${inputStyles} resize-y min-h-[120px]`} required />
            <input type="submit" value="Send Message" className={buttonStyles} />
          </form>
          
          <p className="mt-4 text-[0.85rem] text-[#666] font-manrope text-center">
            Or email directly:{' '}
            <a className="font-bold no-underline text-lab-blue-deep hover:underline" href="mailto:cubistheart@gmail.com?subject=🧊🫀🔭">
              cubistheart@gmail.com
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;