import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import DecryptedText from '../../ui/DecryptedText';
import ArrowFillButton from '../../ui/arrow-fill-button';

export const HeroNavigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="hero-nav-transparent absolute top-0 left-0 right-0 z-40 w-full px-6 sm:px-10 lg:px-16 pt-6 pb-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand Lockup */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white no-underline select-none group"
          aria-label="CarbonFlow Home"
        >
          <span className="font-['Poppins'] font-light text-[24px] tracking-tight text-white"> 
            CarbonFlow
          </span>
        </Link>

        {/* Center Desktop Navigation Links — Shifted leftwards so they don't overlap the laser beam */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] sm:text-[16px] font-['Roboto'] font-normal text-[#B5B9C4] md:-translate-x-16 lg:-translate-x-24">
          <a
            href="#section-02"
            className="relative inline-block text-[#B5B9C4] hover:text-white transition-colors duration-150 no-underline
         after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full
         after:origin-left after:scale-x-0 after:bg-white
         after:transition-transform after:duration-300 after:ease-out
         hover:after:scale-x-100"
          >
            <DecryptedText
              text="How It Works"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
          <a
            href="#section-04"
            className="relative inline-block text-[#B5B9C4] hover:text-white transition-colors duration-150 no-underline
         after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full
         after:origin-left after:scale-x-0 after:bg-white
         after:transition-transform after:duration-300 after:ease-out
         hover:after:scale-x-100"
          >
            <DecryptedText
              text="Capabilities"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
          <a
            href="#final-section"
            className="relative inline-block text-[#B5B9C4] hover:text-white transition-colors duration-150 no-underline
         after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full
         after:origin-left after:scale-x-0 after:bg-white
         after:transition-transform after:duration-300 after:ease-out
         hover:after:scale-x-100"
          >
            <DecryptedText
              text="Impact"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
        </nav>

        {/* Auth Navigation — Sign In & Sign Up / Dashboard with ArrowFillButton */}
        <div className="hidden md:flex items-center gap-3 text-sm font-['Roboto']">
          <Link
            to="/login"
            className="text-[#B5B9C4] hover:text-white transition-colors px-3 py-1.5 no-underline font-normal text-[13.5px]"
          >
            <DecryptedText
              text="Sign In"
              animateOn="hover"
              speed={35}
              maxIterations={8}
              encryptedClassName="text-[#8EA5FF]"
            />
          </Link>

          <SignedOut>
            <ArrowFillButton
              btnText={
                <DecryptedText
                  text="Sign Up"
                  animateOn="hover"
                  speed={35}
                  maxIterations={8}
                  encryptedClassName="text-[#5B5B5B]"
                />
              }
              href="/signup"
              bgColor="#FFFFFF"
              textColor="#0A0A0A"
              fillBgColor="#0A0A0A"
              fillTextColor="#FFFFFF"
              hoverFillBgColor="#8EA5FF"
              hoverFillTextColor="#0A0A0A"
              arrowColor="#0A0A0A"
              hoverArrowColor="#0A0A0A"
              className="!h-9 !px-4 !text-[13px] [--icon-circle:26px] [--icon-right:4px] shadow-sm"
            />
          </SignedOut>

          <SignedIn>
            <ArrowFillButton
              btnText={
                <DecryptedText
                  text="Dashboard"
                  animateOn="hover"
                  speed={35}
                  maxIterations={8}
                  encryptedClassName="text-[#5B5B5B]"
                />
              }
              href="/app/dashboard"
              bgColor="#FFFFFF"
              textColor="#0A0A0A"
              fillBgColor="#0A0A0A"
              fillTextColor="#FFFFFF"
              hoverFillBgColor="#8EA5FF"
              hoverFillTextColor="#0A0A0A"
              arrowColor="#0A0A0A"
              hoverArrowColor="#0A0A0A"
              className="!h-9 !px-4 !text-[13px] [--icon-circle:26px] [--icon-right:4px] shadow-sm"
            />
          </SignedIn>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#B5B9C4] hover:text-white p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-white/40"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer (Clean, transparent drop) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-4 pb-6 px-6 bg-[#03000a]/95 border-b border-white/10 rounded-2xl flex flex-col gap-4 font-['Roboto'] text-sm">
          <a
            href="#section-02"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#B5B9C4] hover:text-white py-1"
          >
            <DecryptedText
              text="How It Works"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
          <a
            href="#section-04"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#B5B9C4] hover:text-white py-1"
          >
            <DecryptedText
              text="Capabilities"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
          <a
            href="#final-section"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#B5B9C4] hover:text-white py-1"
          >
            <DecryptedText
              text="Impact"
              animateOn="hover"
              speed={35}
              maxIterations={10}
              encryptedClassName="text-[#8EA5FF]"
            />
          </a>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {isSignedIn ? (
              <Link
                to="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white text-black text-center py-2 rounded-full font-medium"
              >
                <DecryptedText
                  text="Dashboard"
                  animateOn="hover"
                  speed={35}
                  maxIterations={8}
                  encryptedClassName="text-[#5B5B5B]"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-[#B5B9C4] py-1.5"
                >
                  <DecryptedText
                    text="Sign In"
                    animateOn="hover"
                    speed={35}
                    maxIterations={8}
                    encryptedClassName="text-[#8EA5FF]"
                  />
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white text-black text-center py-2 rounded-full font-medium"
                >
                  <DecryptedText
                    text="Get Started"
                    animateOn="hover"
                    speed={35}
                    maxIterations={8}
                    encryptedClassName="text-[#5B5B5B]"
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
