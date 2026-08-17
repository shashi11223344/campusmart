import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

interface CardItem { title: string; description: string; }

const DEFAULTS = {
  heroTitle: 'Digital Transformation',
  heroSubtitle: 'Transform your campus with cutting-edge digital solutions. From smart classrooms to complete campus automation.',
  heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  section1Title: 'Digital Services',
  cards: [
    { title: 'Smart Classrooms', description: 'Comprehensive solutions for modern education.' },
    { title: 'Campus Automation', description: 'Comprehensive solutions for modern education.' },
    { title: 'Digital Learning', description: 'Comprehensive solutions for modern education.' }
  ] as CardItem[]
};

const DigitalTransformation = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('digital-transformation');

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
  const cards: CardItem[] = (data.cards && data.cards.length > 0) ? data.cards : DEFAULTS.cards;

  return (
    <main className="min-h-screen">
      <section className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div ref={heroRef} className="relative h-[300px] sm:h-[350px] md:h-[350px] overflow-hidden rounded-2xl max-w-5xl mx-auto">
          <img src={heroImage} alt={heroTitle} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cm-blue/90 to-cm-blue/60" />
          <div className="relative w-full mx-auto px-6 sm:px-8 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{heroTitle}</h1>
              <p className="text-xl text-white/90 mb-2">
                {heroSubtitle}
              </p>
              <Link to="/request-quote" className="btn-secondary inline-flex items-center gap-2">
                Start Transformation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-cm-blue-dark mb-8">{section1Title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c: CardItem) => (
              <div key={c.title} className="bg-white rounded-xl p-8 shadow-sm transition-shadow hover:shadow-sm-hover duration-300">
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

export default DigitalTransformation;
