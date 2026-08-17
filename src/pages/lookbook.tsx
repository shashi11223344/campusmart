import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Download } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

const DEFAULTS = {
  heroTitle: 'Play Furniture Lookbook',
  heroSubtitle: 'Play area solutions for early childhood education.',
  heroImage: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  section1Title: 'Download Play Furniture Lookbook'
};

const Lookbook = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('lookbook');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const heroImage = data.heroImage ?? DEFAULTS.heroImage;
  const section1Title = data.section1Title ?? DEFAULTS.section1Title;

  return (
    <main className="min-h-screen bg-white">
      <section className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div ref={heroRef} className="bg-cm-red rounded-2xl py-8 sm:py-10 md:py-12 px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{heroTitle}</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <img
              src={heroImage}
              alt={heroTitle}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-2xl font-bold text-cm-blue-dark mb-4">{section1Title}</h2>
            <p className="text-gray-600 mb-6">Explore our range of play area furniture.</p>
            <button className="btn-primary inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Lookbook;
