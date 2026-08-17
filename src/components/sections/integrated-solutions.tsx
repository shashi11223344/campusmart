import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IntegratedSolutions = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headline = containerRef.current?.querySelector('.integrated-headline');
      if (headline) {
        gsap.fromTo(
          headline,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-[#f1f3f5] py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="integrated-headline">
          <div className="mb-3 text-sm md:text-base font-black uppercase tracking-[0.2em] text-blue-600">
            Integrated solutions
          </div>
          <h2 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
            Building future-ready campuses with integrated solutions.
          </h2>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            From physical infrastructure to digital transformation, we bring planning, products, technology and execution together to create intelligent, sustainable and high-performing campuses.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntegratedSolutions;
