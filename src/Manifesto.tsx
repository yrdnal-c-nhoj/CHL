import React, { FC } from 'react';
import TopNav from './components/TopNav';
import Footer from './components/Footer';

const Manifesto: FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pb-16 w-full relative overflow-y-auto">
      <TopNav />
      <div className="flex flex-col items-start w-[90%] max-w-[60ch] z-10 text-[#060706] lg:w-[70%] lg:max-w-[70ch]">
        <h1 className="font-roboto text-lab-red tracking-widest text-[clamp(1.7rem,2vw,3rem)] text-center w-full my-2 leading-[1.4em]">
          MANIFESTO
        </h1>
        <div className="w-full">
          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)]沟通 leading-relaxed text-left">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              We Take Pictures
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">WE APPROPRIATE BEAUTIFUL</span> images,
            scavenged from the infinite scroll of the Internet. Pictures distort
            time. We catch them as they swim by, and remix them.
            <span className="block mt-1">
              We are not thieves; we are alchemists.
              <br />
              &nbsp;
            </span>
          </p>

          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-left">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              We Love Typefaces
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">BORN FROM PASSION</span> and shared like
            a secret handshake. Each contains the urgency to communicate
            information as well as the need to create, as unique as the maker's
            fingerprint.
            <span className="block mt-1">
              Across the page the symbols move.
              <br />
              &nbsp;
            </span>
          </p>

          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-left">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              We Use Open-Source Code
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">WE EMPLOY SCRIPTS,</span> tools,
            libraries, and frameworks built by countless hands all around the
            world. It is history's most successful group project. We copy and we
            clone and we fork and we install with joy and with gratitude in our
            cubist hearts.
            <span className="block mt-1">
              We code on the shoulders of giants. <br />
              &nbsp;
            </span>
          </p>

          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-left">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              We Believe in Electrons
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">
              INVISIBLE, ENDLESSLY JUMPING.{' '}
            </span>{' '}
            Like us, they occupy a place at the blurry and busy intersection of
            Nature, Culture and Technology. They subatomically convey all our
            ambitions, dreams, thoughts, emotions and knowledge.
            <span className="block mt-1">
              The unseen renders the intangible.
              <br />
              &nbsp;
            </span>
          </p>

          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-left">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              We Use AI
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">A NEW TOOL</span> is a new toy. It helps
            us to make new things and to learn new things and to write new
            things, like manifestos.
            <span className="block mt-1">
              We move forward without fear.
              <br />
              &nbsp;
            </span>
          </p>

          <p className="font-manrope mt-8 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed text-left">
            <span className="font-roboto text-[1.1rem] font-bold text-lab-red mt-4 -mb-[1.9rem] block">
              Plus Ars Citius Omni Tempore Nam Quisque*
              <br />
              &nbsp;
            </span>
            <span className="font-manrope text-[0.75rem] font-bold tracking-wider uppercase">WE HONOR AND THANK</span> our
            collaborators everywhere.
            <br />
            &nbsp;
            <span className="block mt-1">&nbsp;</span>
            <span className="block text-[0.7rem] italic text-right text-[#4d514d]">
              *"More Art Faster For Everybody All The Time"
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Manifesto;
