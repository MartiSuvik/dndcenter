import { useState, useEffect } from 'react';
import Navbar from '../components/ui/Navbar';
import HomeHeroTop from '../components/home/HomeHeroTop';
import HomeCollections from '../components/home/HomeCollections';
import HomeProjectsCards from '../components/home/HomeProjectsCards';
import HomeHowWeWork from '../components/home/HomeHowWeWork';
import HomeHistorySection from '../components/home/HomeHistorySection';
import HomeHeroBottom from '../components/home/HomeHeroBottom';
import VisionnaireSection from '../components/home/VisionnaireSection';
import SustainabilitySection from '../components/home/SustainabilitySection';
import Footer from '../components/ui/Footer';



function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function triggerFooterContact(): void {
    const footerElement = document.getElementById('footer'); // Make sure your Footer has id="footer"
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
      // Optionally, if you need to trigger a button inside the footer after scrolling:
      setTimeout(() => {
        const footerContactBtn = footerElement.querySelector(
          '[data-footer-contact]'
        ) as HTMLButtonElement | null;
        if (footerContactBtn) {
          footerContactBtn.click();
        }
      }, 500); // Adjust delay as needed
    }
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        triggerFooterContact={triggerFooterContact}
      />
      <main className="pb-16">
        <HomeHeroTop />
        <HomeProjectsCards />
        <HomeCollections />
        <HomeHowWeWork />
        <SustainabilitySection />
        <VisionnaireSection />
        <HomeHistorySection />
        <HomeHeroBottom />
      </main>
      <Footer />
    </div>
  );
}

export default Home;