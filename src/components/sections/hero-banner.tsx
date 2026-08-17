import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteContent } from '@/contexts/SiteContentContext';

gsap.registerPlugin(ScrollTrigger);

const HeroBanner = () => {
  const { content } = useSiteContent();
  const heroData = content.home_hero || {
    title: 'Your Complete Guide to Campus Infrastructure',
    subtitle: 'Physical + Digital',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Subtitle fade in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0
      )
        // Title line by line
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.3'
        )
        // Paragraph fade in
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full"
      style={{
        minHeight: '650px',
        backgroundImage: `linear-gradient(90deg,rgba(2,22,50,.96) 0%,rgba(2,22,50,.83) 42%,rgba(2,22,50,.24) 78%), url('${heroData.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl text-white">
              <div 
                ref={subtitleRef}
                className="text-xs sm:text-sm md:text-base font-black uppercase tracking-widest text-blue-300 mb-4"
              >
                Future-ready campus infrastructure
              </div>
              
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
                style={{ letterSpacing: '-1.5px' }}
              >
                Design. Build.<br />
                Digitize. Operate.<br />
                <span style={{ color: '#8fc7ff' }}>Future-Ready Campuses.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl leading-relaxed">
                {heroData.subtitle || 'End-to-end infrastructure and technology solutions that transform universities into intelligent, sustainable and future-ready campuses.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-12">
                <a 
                  href="/request-quote" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 text-blue-900 font-black rounded-md hover:bg-yellow-300 transition-all duration-300 text-sm sm:text-base"
                >
                  Explore Solutions →
                </a>
                <a 
                  href="/contact-us" 
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-white/50 text-white font-black rounded-md hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
                >
                  Schedule Campus Audit →
                </a>
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap gap-8 sm:gap-12">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Campus Projects</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">25M+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Sq. Ft. Delivered</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">250+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Institutions Served</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">20+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
