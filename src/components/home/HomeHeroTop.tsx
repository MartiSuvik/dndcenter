import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollArrow from '../ui/ScrollArrow';

const HomeHeroTop = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const craftedTitleRef = useRef<HTMLHeadingElement>(null); // "Crafted Interiors"
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const playVideo = () => {
      if (video) {
        video.play().catch(error => {
          console.log('Autoplay prevented:', error);
          // Optionally, you can show a play button to the user
        });
      }
    };

    // Ensure the video plays after user interaction
    document.addEventListener('click', playVideo, { once: true });

    return () => {
      document.removeEventListener('click', playVideo);
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Split the title into individual letters for staggered animation
    const titleLetters = titleRef.current?.querySelectorAll('span') || [];
    gsap.set(titleLetters, {
      opacity: 0,
      rotateX: -90,
      transformOrigin: 'top center',
    });

    tl.fromTo(
      videoRef.current,
      { scale: 1.1, filter: 'brightness(0)' },
      { scale: 1, filter: 'brightness(1)', duration: 2.4, ease: 'power2.inOut' }
    )
      .fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.8 },
        '-=2'
      )
      .to(
        titleLetters,
        {
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        },
        '-=1'
      )
      // Fade in "Crafted Interiors" only (no slide)
      .fromTo(
        craftedTitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5 },
        '-=1.4'
      )
      .fromTo(
        arrowRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' },
        '-=0.5'
      );

    // Continuous arrow bounce animation
    gsap.to(arrowRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden perspective-1000">
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          poster="https://res.cloudinary.com/dnddesigncenter/image/upload/v1740566639/qtc6byie8s2vb0jgzrna.jpg"
        >
          <source
src="https://res.cloudinary.com/dnddesigncenter/video/upload/f_auto,q_auto:good/luxury-design-catalogue.mp4"
  type="video/mp4"
/>
        </video>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"
        />
      </div>

      <div className="flex min-h-svh items-center justify-center">
        <div className="container text-center mx-auto relative z-10 px-4">
          <div className="grid grid-cols-1 items-start gap-6 md:gap-12 py-16 md:items-end md:py-24 lg:gap-x-20 lg:py-28">
            <div className="mx-auto">
              <h1
                ref={titleRef}
                className="mb-3 md:mb-5 text-5xl sm:text-6xl md:text-10xl text-text-alternative transform-gpu uppercase flex justify-center flex-wrap space-x-2 text-white/90 text-shadow"
                style={{ perspective: '800px' }}
              >
                {"LUXURY ITALIAN".split('').map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block transform-gpu"
                    style={{ display: 'inline-block', perspective: '800px' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h1>
              {/* "Crafted Interiors": fades in and then remains static; the golden shine loops inside */}
              <h2
                ref={craftedTitleRef}
                className="mb-3 md:mb-5 text-3xl sm:text-4xl md:text-6xl uppercase crafted-shine text-shadow"
                style={{ opacity: 1 }}
              >
                Crafted Interiors
              </h2>
              <p
                ref={subtitleRef}
                className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl font-light text-shadow"
                style={{ willChange: 'transform, opacity, filter' }}
              >
                Custom Crafted Designs for Elegant Living
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={arrowRef}
        className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
      >
        <ScrollArrow
          targetId="HomeProjectsCards"
          className="w-10 h-10 md:w-12 md:h-12 text-white hover:text-[#C5A267] transition-colors duration-300"
        />
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
        /* Subtle text shadow for better readability */
        .text-shadow {
          text-shadow: 0 2px 15px rgba(0, 0, 0, 0.6);
        }
        /* Crafted Interiors: static white text with an animated golden shine inside */
        .crafted-shine {
          position: relative;
          /* Set a white base using background properties */
          background: linear-gradient(
            130deg,
            white 80%,
            rgba(197, 162, 103, 1) 80%,
            rgba(197, 162, 103, 1) 82%,
            white 82%,
            white 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 6s linear infinite;
        }
        @keyframes shine {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeHeroTop;