import React from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';

const About: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center w-full min-h-screen pb-16 overflow-y-auto">
      <TopNav />

      <div className="flex flex-col items-center w-[90%] max-w-[60ch] z-10 text-[#060706] lg:w-[70%] lg:max-w-[70ch]">
        <h1 className="font-roboto text-lab-red tracking-widest text-[clamp(1.7rem,2vw,3rem)] text-center w-full my-2 leading-[1.4em]">
          ABOUT
        </h1>
        <section className="w-full">
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-center">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              About BorrowedTime
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">a project by </span>Cubist Heart
            Laboratories, BorrowedTime is new clock each day, using found images
            from the Internet. It is made with VSCode using React JavaScript,
            housed on GitHub and deployed on Vercel.
          </p>
          <br />
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-center">
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">Cubist Heart Laboratories </span>
            is a global collective of scientists, artists, and shamans found
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
