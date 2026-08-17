import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePageData } from '@/hooks/usePageData';

interface CardItem { title: string; description: string; }

const DEFAULTS = {
  heroTitle: 'Library Management System',
  heroSubtitle: 'Modernize your library with our AI-driven management software. Digital cataloging, e-journal integration, and advanced search systems.',
  cards: [
    { title: 'Digital Cataloging', description: 'Streamline your library operations.' },
    { title: 'E-Journal Access', description: 'Streamline your library operations.' },
    { title: 'User Management', description: 'Streamline your library operations.' }
  ] as CardItem[]
};

const LibraryManagement = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('library-management');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const cards: CardItem[] = (data.cards && data.cards.length > 0) ? data.cards : DEFAULTS.cards;

  return (
    <main className="min-h-screen">
      <section ref={heroRef} className="bg-amber-700 mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] py-6 md:py-8 my-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{heroTitle}</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-4">
        <div className="w-full mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {cards.map((c: CardItem) => (
              <div key={c.title} className="bg-white rounded-xl p-8 shadow-sm text-center transition-shadow hover:shadow-sm-hover duration-300">
                <h3 className="text-xl font-bold text-cm-blue-dark mb-4">{c.title}</h3>
                <p className="text-gray-600">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LibraryManagement;
