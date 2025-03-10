import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollManager } from '../../hooks/useScrollManager';
import ImageGallery from './ImageGallery';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Main category structure
interface Category {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  hasSubcategories: boolean;
  subcategories?: Subcategory[];
}

// Subcategory structure
interface Subcategory {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  parentId: number;
}

// Combined type for display
type DisplayItem = Category | Subcategory;

// Main categories with subcategories
const mainCategories: Category[] = [
  {
    id: 1,
    title: 'KITCHEN',
    subtitle: 'Culinary Excellence',
    description: 'Luxury kitchens designed for functionality and aesthetics.',
    image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/1_converted_abtrac.avif',
    hasSubcategories: true,
    subcategories: [
      {
        id: 101,
        title: 'MODERN',
        subtitle: 'Contemporary Kitchen',
        description: 'Clean lines and minimalist design for modern culinary spaces.',
        image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Kitchen_Modern_8.avif',
        parentId: 1
      },
      {
        id: 102,
        title: 'TRADITIONAL',
        subtitle: 'Classic Kitchen',
        description: 'Timeless elegance with rich details and warm tones.',
        image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Kitchen_Traditional_8.avif',
        parentId: 1
      },
      {
        id: 103,
        title: 'ART DECO',
        subtitle: 'Artistic Kitchen',
        description: 'Bold geometric patterns and luxurious finishes.',
        image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/Kitchen_Art_Deco_16.avif',
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    title: 'FURNITURE',
    subtitle: 'Elegant Comfort',
    description: 'Experience perfect blend of luxury living and comfort.',
    image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/2_converted_dvxxxk.avif',
    hasSubcategories: true,
    subcategories: [
      {
        id: 201,
        title: 'LIVING ROOM',
        subtitle: 'Living Space',
        description: 'Sophisticated living room furniture for elegant relaxation.',
        image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/v1740762207/1_f2q7q7.avif',
        parentId: 2
      },
      {
        id: 202,
        title: 'DINING ROOM',
        subtitle: 'Dining Space',
        description: 'Exquisite dining sets for memorable gatherings.',
        image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/3_converted_uc7sxw.avif',
        parentId: 2
      },
      {
        id: 203,
        title: 'BEDROOM',
        subtitle: 'Bedroom Space',
        description: 'Luxurious bedroom furniture for ultimate comfort.',
        image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/4_converted_z4arig.avif',
        parentId: 2
      }
    ]
  },
  {
    id: 3,
    title: 'LIGHT',
    subtitle: 'Outshine the standard',
    description: 'Illuminate your space with carefully curated lighting.',
    image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/5_converted_d2v3em.avif',
    hasSubcategories: false
  },
  {
    id: 4,
    title: 'BATH',
    subtitle: 'Inner peace of Italy',
    description: 'Luxurious bathrooms with spa-like tranquility.',
    image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/6_converted_r36ncb.avif',
    hasSubcategories: false
  },
  {
    id: 5,
    title: 'OUTDOOR',
    subtitle: 'Outdoor Elegance',
    description: 'Designed outdoor spaces for relaxation and entertainment.',
    image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/7_converted_e3j2zg.avif',
    hasSubcategories: false
  },
  {
    id: 6,
    title: 'OFFICE',
    subtitle: 'Calming Office',
    description: 'Designed office spaces for undisturbed focus.',
    image: 'https://res.cloudinary.com/dnddesigncenter/image/upload/v1739789546/Untitled_design_wvbz0p.avif',
    hasSubcategories: false
  },
];

const HomeProjectsCards = () => {
  // State management
  const [activeId, setActiveId] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);
  const [displayLevel, setDisplayLevel] = useState<'main' | 'sub'>('main');
  const [currentParentId, setCurrentParentId] = useState<number | null>(null);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>(mainCategories);
  const [visibleCards, setVisibleCards] = useState<number>(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerHeight, setContainerHeight] = useState<string>('auto');

  // Refs for animations
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollManager = useScrollManager();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const hasAnimated = useRef(false);

  // Determine how many cards to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(6);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(6);
      } else {
        setVisibleCards(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial fade-in on scroll (only when in main view)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (displayLevel !== 'main') return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const isDesktop = window.innerWidth >= 1024;
    const cardsToAnimate = isDesktop
      ? cardRefs.current.slice(0, visibleCards)
      : cardRefs.current.slice(1, visibleCards);

    const ctx = gsap.context(() => {
      // Set the cards to hidden (opacity: 0)
      gsap.set(cardsToAnimate, { opacity: 0 });
      // Create a ScrollTrigger that fades the cards in when the section enters.
      ScrollTrigger.create({
        trigger: cardsContainerRef.current,
        start: 'top bottom', // When the top of the container reaches the bottom of the viewport.
        onEnter: () => {
          gsap.timeline({ delay: 1, immediateRender: false }).to(cardsToAnimate, {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out'
          });
        },
        once: true
      });
    });

    return () => ctx.revert();
  }, [visibleCards, displayLevel]);

  // Animate back button when it appears
  useEffect(() => {
    if (displayLevel === 'sub' && backButtonRef.current) {
      gsap.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
      );
    }
  }, [displayLevel]);

  const handleOptionClick = (item: DisplayItem) => {
    if (isTransitioning) return;

    const container = cardsContainerRef.current;
    if (container) {
      setContainerHeight(`${container.offsetHeight}px`);
    }

    if ('hasSubcategories' in item && item.hasSubcategories && item.subcategories) {
      if (activeId === item.id) {
        if (container) {
          setIsTransitioning(true);
          // Fade out the container completely.
          gsap.to(container, {
            opacity: 0,
            duration: 1.4,
            ease: 'power2.inOut',
            onComplete: () => {
              // Update state only after the fade-out is complete.
              setCurrentParentId(item.id);
              setDisplayItems(item.subcategories);
              setDisplayLevel('sub');
              setActiveId(item.subcategories[0].id);
              // Ensure container remains hidden.
              gsap.set(container, { opacity: 0 });
              // Fade the container back in.
              gsap.to(container, {
                opacity: 1,
                duration: 1.4,
                ease: 'power2.out',
                onComplete: () => {
                  setIsTransitioning(false);
                  setContainerHeight('auto');
                }
              });
            }
          });
        }
      } else {
        setActiveId(item.id);
      }
    } else {
      if (activeId === item.id) {
        setSelectedItem(item);
      } else {
        setActiveId(item.id);
      }
    }
  };

  const handleBackClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const container = cardsContainerRef.current;
    if (container) {
      setContainerHeight(`${container.offsetHeight}px`);
      gsap.to(container, {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setDisplayItems(mainCategories);
          setDisplayLevel('main');
          setCurrentParentId(null);
          setActiveId(1);
          gsap.set(container, { opacity: 0 });
          gsap.to(container, {
            opacity: 1,
            duration: 1.4,
            ease: 'power2.out',
            onComplete: () => {
              setIsTransitioning(false);
              setContainerHeight('auto');
            }
          });
        }
      });
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    scrollManager.unlockScroll();
  };

  const triggerFooterContact = () => {
    const footerElement = document.querySelector('#footer');
    if (footerElement instanceof HTMLElement) {
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      window.scrollTo({
        top: scrollHeight - windowHeight,
        behavior: 'smooth',
      });
      setTimeout(() => {
        const footerContactBtn = document.querySelector(
          '[data-footer-contact]'
        ) as HTMLButtonElement;
        if (footerContactBtn) {
          footerContactBtn.click();
        }
      }, 800);
    }
  };

  return (
    <section id="HomeProjectsCards" className="relative min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 mb-2">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-center">PRODUCT COLLECTION</h1>
      </div>
      <div className="max-w-1xl mx-auto px-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-sans text-[#B49157] text-center custom-pulse">
          {displayLevel === 'sub' && currentParentId ? (
            mainCategories.find(cat => cat.id === currentParentId)?.title.toUpperCase() === 'FURNITURE'
              ? 'Pick a Room'
              : 'Pick a Style'
          ) : (
            'Click on the cards to get a quick glance'
          )}
        </h1>
      </div>

      <div
        ref={cardsContainerRef}
        className={`grid grid-cols-2 sm:flex sm:flex-wrap gap-4 p-6 md:p-8 w-full max-w-5xl mx-auto mt-2 relative ${
          displayLevel === 'sub' ? 'justify-center' : ''
        }`}
        style={{ 
          minHeight: containerHeight,
          pointerEvents: isTransitioning ? 'none' : 'auto'
        }}
      >
        {displayItems.slice(0, visibleCards).map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            onClick={() => handleOptionClick(item)}
            className={`
              group 
              relative 
              w-full
              h-[200px] sm:h-[300px] md:h-[350px] lg:h-[450px]
              overflow-hidden 
              cursor-pointer 
              ease-out 
              duration-1000
              will-change-transform 
              transform 
              hover:scale-[1.02]
              ${
                displayLevel === 'sub'
                  ? activeId === item.id 
                      ? 'md:w-[300px]'  // Active card width in sub view
                      : 'md:w-[250px]'  // Inactive card width in sub view
                  : activeId === item.id 
                      ? 'w-full sm:w-1/2 md:flex-[2.5]' 
                      : 'w-[45%] sm:w-1/3 md:flex-[0.5]'
              }
            `}
          >
            {displayLevel === 'sub' && currentParentId && (() => {
  const category = mainCategories.find(cat => cat.id === currentParentId)?.title;
  const label = category === "FURNITURE" ? "ROOM" : "STYLE";
  return (
    <div className="absolute top-2 left-2 z-10 p-1">
      <h2 className="text-sm md:text-base font-serif text-white">
        {label}
      </h2>
    </div>
  );
})()}


            {/* Background Image */}
            <div className="absolute inset-0">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-500"
                style={{
                  backgroundImage: `url(${item.image})`,
                  transform: activeId === item.id ? 'scale(1)' : 'scale(1.2)',
                }}
              />
            </div>

            <div className="absolute inset-0" />

            {/* Glow edge (appears on hover) */}
            <div
              ref={(el) => (glowRefs.current[index] = el)}
              className="
                absolute 
                top-0 
                bottom-0 
                right-0 
                w-2 
                bg-gradient-to-r 
                from-transparent 
                to-[#FFF] 
                opacity-0 
                group-hover:opacity-100 
                transition-opacity 
                duration-300
              "
            ></div>

            {/* Content gradient */}
            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end bg-gradient-to-l from-transparent via-black/10 to-black/80">
              {activeId !== item.id ? (
                <div className="absolute inset-0 flex items-center justify-center p-0.5">
                  <h3 className="text-white text-center text-base sm:text-xl font-serif leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-white/90 text-xl sm:text-2xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Haptic circle indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
                    <div className="w-full h-full rounded-full bg-white/80 pointer-events-none z-10 opacity-30 animate-pulse-slow transition-opacity duration-300" />
                  </div>
                </>
              )}
            </div>

            {/* Always-visible arrow, rotates if expanded */}
            <div
              ref={(el) => (arrowRefs.current[index] = el)}
              className="
                absolute 
                bottom-4 
                right-4 
                flex 
                items-center 
                justify-center 
                transition-transform 
                duration-300 
                group-hover:translate-y-1
                min-w-[44px]
                min-h-[44px]
                z-20
              "
            >
              <ChevronDown
                className={`
                  w-6 h-6 sm:w-8 sm:h-8
                  text-[#FFD700] 
                  opacity-70 
                  group-hover:opacity-100 
                  transform-gpu 
                  transition-all 
                  duration-300
                  ${activeId === item.id ? 'rotate-180' : ''}
                `}
                aria-label="Expand for more details"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Image Gallery (modal) */}
      {selectedItem && (
        <ImageGallery
          category={selectedItem.title}
          style={
            displayLevel === 'sub'
              ? mainCategories.find(cat => cat.id === currentParentId)?.title || ''
              : 'Modern'
          }
          onClose={handleClose}
        />
      )}

{/* Footer buttons */}
<div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 px-4">
  {displayLevel === 'sub' && (
    <button
      ref={backButtonRef}
      onClick={handleBackClick}
      className="
        w-full sm:w-48 h-[44px]
        flex items-center justify-center gap-2
        px-4 py-3
        bg-[#B49157]
        text-white
        text-sm
        uppercase
        tracking-wider
        hover:bg-[#A38047]
        transition-colors
        duration-200
        min-h-[44px]
      "
    >
      <ChevronLeft className="w-5 h-5" />
      <span>CATEGORIES</span>
    </button>
  )}

  <Link to="/ProductsCollection" className="w-full sm:w-48">
    <button
      className="
        w-full sm:w-48 h-[44px]
        px-4 py-3
        bg-[#B49157]
        text-white
        text-sm
        uppercase
        tracking-wider
        hover:bg-[#A38047]
        transition-colors
        duration-200
        min-h-[44px]
      "
    >
      View all
    </button>
  </Link>

  <button
    onClick={triggerFooterContact}
    className="
      w-full sm:w-48 h-[44px]
      px-4 py-3
      bg-[#B49157]
      text-white
      text-sm
      uppercase
      tracking-wider
      hover:bg-[#A38047]
      transition-colors
      duration-200
      min-h-[44px]
    "
  >
    Contact us
  </button>
</div>



      {/* Optional custom keyframes for a fancier pulse glow if desired */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
            box-shadow: 0 0 5px 1px #ffd700;
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 15px 2px #ffd700;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HomeProjectsCards;
