import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Laptop, Users } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

interface CardItem { title: string; description: string; }

const DEFAULTS = {
  heroTitle: 'Library Solutions',
  heroSubtitle: 'Modern library solutions that blend traditional resources with digital innovation. Create spaces that inspire learning and research.',
  heroImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  section1Title: 'Library Features',
  cards: [
    { title: 'Digital Cataloging', description: 'Modern library management systems' },
    { title: 'E-Library Solutions', description: 'Digital resources and e-books' },
    { title: 'Reading Spaces', description: 'Comfortable reading environments' },
    { title: 'Collaboration Zones', description: 'Group study and discussion areas' }
  ] as CardItem[]
};

const ICONS = [Search, Laptop, BookOpen, Users];

const Libraries = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('libraries');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
      
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards, 
          { opacity: 0, y: 30 }, 
          { 
            opacity: 1, y: 0, 
            duration: 0.8, 
            stagger: 0.1, 
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const heroImage = data.heroImage ?? DEFAULTS.heroImage;
  const section1Title = data.section1Title ?? DEFAULTS.section1Title;
  const cards: CardItem[] = (data.cards && data.cards.length > 0) ? data.cards : DEFAULTS.cards;

  return (
    <main className="min-h-screen bg-white">
      {/* Standard Corporate Hero */}
      <section ref={heroRef} className="bg-cm-blue mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] py-6 md:py-8 overflow-hidden relative shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 relative z-10 px-4">
          <div className="lg:w-1/2 text-left text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              {heroTitle}
            </h1>
            <p className="text-sm md:text-base text-white/85 leading-snug max-w-xl">
              {heroSubtitle}
            </p>
            <div className="mt-5">
              <Link to="/request-quote" className="btn-secondary px-6 py-2.5 text-sm font-bold">
                Explore Catalog
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <img src={heroImage} alt={heroTitle} className="rounded-2xl shadow-xl w-full h-[260px] object-cover border-2 border-cm-blue-dark relative z-10" />
          </div>
        </div>
      </section>

      {/* Structured Feature Catalog Grid */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-between mb-8">
            <div className="hidden md:block h-1 w-32 bg-cm-yellow" />
            <h2 className="text-2xl md:text-3xl font-bold text-cm-blue-dark tracking-tighter">
              {section1Title}
            </h2>
            <div className="hidden md:block h-1 w-32 bg-cm-yellow" />
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((f, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={f.title} className="group p-8 bg-white border border-slate-200/70 rounded-[2rem] hover:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] min-h-[360px]">
                  <div className="w-16 h-16 bg-cm-blue/5 rounded-full flex items-center justify-center mb-6 border border-cm-blue/10 group-hover:bg-cm-blue transition-all duration-500 shadow-inner">
                    <Icon className="w-8 h-8 text-cm-blue group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-cm-blue-dark mb-3 tracking-tighter group-hover:text-cm-blue transition-colors leading-tight">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow">{f.description}</p>
                  <div className="mt-8 pt-6 border-t border-gray-50 w-full flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4 text-cm-yellow" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cm-blue-dark/40">Resource Center</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 bg-cm-gray/30 rounded-[2rem] mx-4 mb-12 border border-cm-gray overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="p-8 md:p-12 bg-cm-blue-dark rounded-[2.5rem] text-white shadow-xl relative">
              <BookOpen className="absolute top-0 right-0 p-6 w-16 h-16 text-cm-yellow/20" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight tracking-tighter">Beyond Books. Knowledge Networks.</h2>
              <p className="text-base text-white/70 leading-relaxed mb-8 font-opensans">
                The modern library is no longer a warehouse for paper. It's a high-performance intersection where data, digital resources, and human interaction meet.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div className="flex flex-col gap-1">
                  <span className="text-cm-yellow font-bold text-2xl">98%</span>
                  <span className="text-white/50 font-bold text-[10px] uppercase tracking-wider">User Satisfaction</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cm-yellow font-bold text-2xl">Turnkey</span>
                  <span className="text-white/50 font-bold text-[10px] uppercase tracking-wider">Implementation</span>
                </div>
              </div>
            </div>
            
            <div className="relative group p-2 bg-white rounded-[2.5rem] shadow-xl">
               <img src={heroImage} alt="Library" className="rounded-[2rem] w-full h-[350px] object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          </div>
        </div>
      </section>

      {/* Balanced Call to Action */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-cm-blue-dark mb-8 tracking-tighter">Ready to Build the Future?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact-us" className="btn-primary px-10 py-3 text-base">
              Connect With Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Libraries;
