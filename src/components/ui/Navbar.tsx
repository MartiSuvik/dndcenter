import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  triggerFooterContact: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  image?: string;
}

const menuItems: MenuItem[] = [
  { title: 'HOME', href: '/', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/3.png' },
  { title: 'PRODUCTS', href: '/productscollection', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Kitchen_Modern_7.avif' },
  { title: 'HOW WE WORK', href: '/how-we-work', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Untitled_design_3.png' },
  { title: 'SUSTAINABILITY', href: '/sustainability', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Sustainability-Eco-Design-NewYork.jpg' },
  { title: 'VISIONNAIRE', href: '/collaboration', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Untitled_design_1.png' },
  { title: 'BLOG', href: '/blog', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/5.png' },
  { title: 'CONTACT', href: '', image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/1.png' },
];

const Navbar: React.FC<NavbarProps> = ({
  isScrolled,
  isMenuOpen,
  setIsMenuOpen,
  triggerFooterContact,
}) => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => {
    setIsMenuOpen(false);
    setIsHovered(false);
    setActiveItem(null);
  };

  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem('audioMuted');
    return savedMute ? JSON.parse(savedMute) : false;
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        loop 
        autoPlay // added autoPlay attribute to trigger audio playback
        muted={isMuted}
      >
        <source 
          src="https://res.cloudinary.com/dnddesigncenter/video/upload/yc96jefzn2hnsj8tvu6o.mp3" 
          type="audio/mpeg" 
        />
      </audio>

      <nav
        className={`fixed w-full z-50 transition-all duration-300 transform ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-transparent'
        } ${isMenuOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dnddesigncenter/image/upload/D_D_h52kdi.svg"
                alt="D&D Design Center"
                className={`h-14 md:h-14 transition-all duration-300 ${
                  isScrolled ? 'brightness-0' : 'brightness-0 invert'
                }`}
              />
            </Link>

            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Mobile Call Button */}
              <a 
                href="tel:+17189347100" 
                className="md:hidden flex items-center justify-center w-10 h-10 text-white bg-[#C5A267] rounded-full"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
              
              {/* Volume Control */}
              <button
                onClick={toggleMute}
                className={`hidden md:flex items-center justify-center w-10 h-10 ${
                  isScrolled ? 'text-[#2D2D2D]' : 'text-white'
                } hover:scale-110 transition-all duration-300`}
                aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>

              <span
                className={`hidden md:inline-block sm:text-3xl font-serif ${
                  isScrolled ? 'text-[#2D2D2D]' : 'text-white'
                }`}
              >
                MENU
              </span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-1 rounded-md transition-all duration-1000 ${
                  isScrolled ? 'text-[#2D2D2D]' : 'text-white'
                } hover:scale-110 min-w-[44px] min-h-[44px]`}
                aria-label="Menu"
              >
                <Menu className="w-12 h-12 md:w-12 md:h-12" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-1000 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      >
        <div
          className={`fixed top-0 right-0 h-screen w-full md:w-auto flex transform transition-transform duration-1000 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-[#2D2D2D] hover:scale-110 transition-transform duration-1000 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
              isHovered ? 'w-0 md:w-[500px]' : 'w-0'
            }`}
          >
            {menuItems.map((item, index) => (
              <div
                key={item.title}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeItem === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image ?? ''})` }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>

          <div className="w-full md:w-[300px] bg-white flex flex-col h-full">
            <div className="pt-12 pb-8 px-6 md:px-12 flex justify-center items-center">
              <img
                src="https://res.cloudinary.com/dnddesigncenter/image/upload/D_D_h52kdi.svg"
                alt="D&D Design Center"
                className="w-32 md:w-32 brightness-0"
              />
            </div>

            <nav className="flex-1 px-6 md:px-12 flex flex-col items-start space-y-6 md:space-y-8">
              {menuItems.map((item, index) => {
                const handleItemClick = () => {
                  handleClose();
                  if (item.title === 'CONTACT') {
                    triggerFooterContact();
                  }
                };

                // Render CONTACT as a button
                if (item.title === 'CONTACT') {
                  return (
                    <button
                      key={item.title}
                      type="button"
                      className="block text-left text-[18px] md:text-[20px] font-serif text-[#2D2D2D] hover:text-[#C5A267] transition-colors duration-200 min-h-[44px] flex items-center"
                      onClick={handleItemClick}
                      onMouseEnter={() => {
                        setActiveItem(index);
                        setIsHovered(true);
                      }}
                      onMouseLeave={() => {
                        setIsHovered(false);
                      }}
                    >
                      {item.title}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="block text-[18px] md:text-[20px] font-serif text-[#2D2D2D] hover:text-[#C5A267] transition-colors duration-200 min-h-[44px] flex items-center"
                    onClick={handleItemClick}
                    onMouseEnter={() => {
                      setActiveItem(index);
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                      setIsHovered(false);
                    }}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile-only contact info */}
            <div className="md:hidden px-6 py-6 border-t border-gray-200">
              <a href="tel:+17189347100" className="flex items-center space-x-3 text-[#C5A267] mb-4 min-h-[44px]">
                <Phone className="w-5 h-5" />
                <span>(718) 934-7100</span>
              </a>
              <p className="text-sm text-gray-500">
                2615 East 17th Street Brooklyn, New York 11235, USA
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;