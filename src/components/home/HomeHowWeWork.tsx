import { Link } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';
import { ArrowRight } from 'lucide-react';


const HomeHowWeWork = () => {
  return (
    <section id="italian-craftsmanship" className="py-12 md:py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content Section with staggered animations */}
          <div className="space-y-6 md:space-y-8">
            <AnimatedSection>
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif">
                  HOW WE DESIGN
                </h2>
                <p className="text-[#B49157] uppercase tracking-wider text-sm md:text-base">
                  How We Transform your Home From Vision to Reality
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                At <i>D&D Design Center</i>, we blend craftsmanship with
                innovation to bring your vision to life. From personalized
                consultations to precision execution.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <Link
                to="/how-we-work"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A267] text-white font-medium rounded-sm hover:bg-[#D6B378] transition-colors duration-300 group min-h-[44px]"
              >
                HOW WE WORK
                <ArrowRight className="w-5 h-5 transform group-hover:translate- x-1 transition-transform duration-300" />
              </Link>
            </AnimatedSection>
          </div>

          
          {/* Video Section with animation (Right Side) */}
          <AnimatedSection
            delay={200}
            className="relative aspect-w-16 aspect-h-9 bg-gray-100 overflow-hidden"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="https://res.cloudinary.com/dnddesigncenter/image/upload/f_auto/wittyqg0juxstnsaepl0.jpg"
            >
              <source
                src="https://res.cloudinary.com/dnddesigncenter/video/upload/f_auto,q_auto:good/Home-Craftsmanship-NewYork.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default HomeHowWeWork;