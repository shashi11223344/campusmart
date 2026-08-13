import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Database, Code } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

interface Card { title: string; description: string; image?: string; }

const DEFAULTS = {
  heroTitle: 'AI & Machine Learning',
  heroSubtitle: 'Cutting-edge AI and ML solutions for educational institutions. Prepare students for the future with hands-on learning experiences.',
  heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  section1Title: 'AI/ML Solutions',
  section2Title: 'Future-Ready Education',
  cards: [
    { title: 'AI Learning Stations', description: 'Interactive AI-powered learning environments' },
    { title: 'ML Labs', description: 'Machine learning experimentation setups' },
    { title: 'Coding Platforms', description: 'Programming and development environments' },
    { title: 'Computing Infrastructure', description: 'High-performance computing solutions' },
  ] as Card[],
  features: [] as string[],
};

const ICONS = [Brain, Database, Code, Cpu];

const AIML = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('ai-ml');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'expo.out' });
      
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards, 
          { opacity: 0, x: -20 }, 
          { 
            opacity: 1, x: 0, 
            duration: 0.8, 
            stagger: 0.1, 
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
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
  const section2Title = data.section2Title ?? DEFAULTS.section2Title;
  const cards: Card[] = (data.cards && data.cards.length > 0) ? data.cards : DEFAULTS.cards;

  return (
    <main className="min-h-screen bg-white">
      {/* High-Tech Hero - Standardized to Corporate Style */}
      <section ref={heroRef} className="bg-cm-blue mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] py-6 md:py-8 overflow-hidden relative shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 relative z-10 px-4">
          <div className="lg:w-1/2 text-left text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-cm-yellow" />
              <span className="text-cm-yellow font-bold text-[10px] uppercase tracking-[0.3em]">Neural Systems Online</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              {heroTitle}
            </h1>
            <p className="text-sm md:text-base text-white/85 leading-snug max-w-xl">
              {heroSubtitle}
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link to="/request-quote" className="btn-secondary px-6 py-2.5 text-sm font-bold">
                Deploy Solutions
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <img src={heroImage} alt={heroTitle} className="rounded-2xl shadow-xl w-full h-[260px] object-cover border-2 border-cm-blue-dark relative z-10" />
          </div>
        </div>
      </section>

      {/* Module Grid */}
      <section className="py-10 md:py-14 relative">
        <div className="w-full mx-auto px-4 sm:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-cm-blue-dark tracking-tighter">{section1Title}</h2>
            <div className="hidden md:block h-1 w-32 bg-cm-yellow rounded-full" />
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={s.title} className="group bg-white border border-slate-200/70 rounded-[2rem] hover:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] min-h-[360px] p-8">
                  <div className="relative mb-8">
                    <div className="w-16 h-16 bg-cm-blue/5 rounded-2xl flex items-center justify-center group-hover:bg-cm-blue group-hover:scale-110 transition-all duration-500 border border-cm-blue/10 shadow-inner">
                      <Icon className="w-8 h-8 text-cm-blue group-hover:text-white" />
                    </div>
                  </div>

                  <div className="relative font-opensans flex-grow">
                    <h3 className="text-xl font-bold text-cm-blue-dark mb-3 tracking-tighter group-hover:text-cm-blue transition-colors leading-tight">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-50 w-full flex items-center justify-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cm-yellow" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cm-blue-dark/40">AI-Powered</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Futuristic Feature Section */}
      <section className="py-10 md:py-14 bg-cm-gray/30 border-y border-cm-gray rounded-[2rem] mx-4 mb-12 overflow-hidden shadow-sm">
        <div className="w-full mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="p-8 bg-white border border-gray-200 rounded-[2rem] relative shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-cm-blue-dark mb-6 tracking-tight">{section2Title}</h2>
                <p className="text-gray-600 text-base leading-relaxed mb-8 font-opensans">
                  Our AI/ML systems are built on a modular architecture, allowing institutions to scale from single-station coding pods to campus-wide neural networks.
                </p>
                <ul className="space-y-4 font-opensans">
                  {['Scalable Architecture', 'Low-Latency Neural Compute', 'NEP 2020 Dataset Integration'].map((item) => (
                    <li key={item} className="flex items-center gap-3 group">
                      <div className="w-2 h-2 bg-cm-yellow rounded-full group-hover:scale-150 transition-transform" />
                      <span className="text-cm-blue-dark font-bold text-xs tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-cm-blue blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Engine" className="relative rounded-[2rem] border-4 border-white shadow-2xl transition-all duration-700 h-[320px] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Tech CTA */}
      <section className="py-16 text-center relative overflow-hidden bg-cm-blue-dark text-white rounded-t-[4rem] border-t-4 border-cm-yellow/50">
        <div className="relative z-10 w-full mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">Initiate Sync Phase</h2>
          <p className="text-lg text-white/50 mb-8 font-bold uppercase tracking-[0.2em] font-opensans">Contact our core engineering team today.</p>
          <Link to="/contact-us" className="btn-secondary px-12 py-3 text-xl font-bold transition-all shadow-2xl">
            Establish Connection
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AIML;
