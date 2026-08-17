import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Download } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

const DEFAULTS = {
  heroTitle: 'UGC Guidelines for Digital Campus',
  heroSubtitle: 'Latest UGC guidelines for digital transformation of campuses.',
  section1Title: 'Key Guidelines',
  features: [
    'Digital Infrastructure Requirements',
    'Online Learning Standards',
    'Data Security Protocols',
    'Student Privacy Guidelines',
    'Compliance Checklist'
  ]
};

const UGCGuidelines = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('ugc-guidelines');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const section1Title = data.section1Title ?? DEFAULTS.section1Title;
  const features = (data.features && data.features.length > 0) ? data.features : DEFAULTS.features;

  return (
    <main className="min-h-screen bg-white">
      <section className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div ref={heroRef} className="bg-cm-blue-dark rounded-2xl py-8 sm:py-10 md:py-12 px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{heroTitle}</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-cm-blue-dark mb-6">{section1Title}</h2>
            <ul className="space-y-4 text-gray-700 mb-2">
              {features.map((feature: string) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <button className="btn-primary inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Guidelines
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UGCGuidelines;
