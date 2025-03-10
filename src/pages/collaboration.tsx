import { useState, useEffect } from 'react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import VisionnaireHero from '../components/collaboration/VisionnaireHero';
import VisionnaireIntroWithLoopingWords from '../components/collaboration/VisionnaireIntroWithLoopingWords';
import VisionnaireShowcase from '../components/collaboration/VisionnaireShowcase';
import VisionnaireCTA from '../components/collaboration/VisionnaireCTA';
import VisionnaireThankYou from '../components/collaboration/VisionnaireThankYou';
import { HeroScrollDemo } from '../components/ui/HeroScrollDemo';
import { GridMotionDemo } from '../components/collaboration/GridMotionDemo';



const Collaboration = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerFooterContact = () => {
    const footerElement = document.querySelector('#footer');
    if (footerElement instanceof HTMLElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const footerContactBtn = document.querySelector('[data-footer-contact]') as HTMLButtonElement;
        if (footerContactBtn) {
          footerContactBtn.click();
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        triggerFooterContact={triggerFooterContact}
      />
      <main>
        <VisionnaireHero />
        <VisionnaireIntroWithLoopingWords />
        <GridMotionDemo />
        <VisionnaireShowcase />
        <VisionnaireThankYou />
        <HeroScrollDemo />
        <VisionnaireCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Collaboration;