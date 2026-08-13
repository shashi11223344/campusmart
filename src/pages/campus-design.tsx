import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Building2, Ruler, PenTool, CheckCircle } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

interface Card { title: string; description: string; image?: string; }

const DEFAULTS = {
  heroTitle: 'Campus Design',
  heroSubtitle: 'Transform your educational vision into reality with our comprehensive campus design services. We create spaces that inspire learning and foster innovation.',
  heroImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  section1Title: 'Our Design Services',
  section2Title: "Why Choose Our Campus Design?",
  ctaTitle: "Ready to Design Your Dream Campus?",
  ctaSubtitle: "Let our expert team help you create a campus that inspires and empowers.",
  cards: [
    { title: 'Master Planning', description: 'Comprehensive campus master planning for new and existing institutions.', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Architectural Design', description: 'Innovative architectural solutions for educational buildings.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Interior Design', description: 'Functional and aesthetic interior spaces for learning.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Landscape Design', description: 'Outdoor spaces that enhance the campus environment.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  ] as Card[],
  features: [
    'Space optimization and utilization analysis',
    'Sustainable and eco-friendly design',
    'NEP 2020 compliant layouts',
    'Accessibility and inclusivity',
    'Future-ready infrastructure',
    'Cost-effective solutions',
  ],
};

const PROCESS_STEPS = [
  { icon: Building2, title: 'Discovery', description: 'Understanding your needs and vision' },
  { icon: Ruler, title: 'Planning', description: 'Strategic space planning and analysis' },
  { icon: PenTool, title: 'Design', description: 'Creating detailed design proposals' },
  { icon: CheckCircle, title: 'Execution', description: 'Bringing designs to life' },
];

const CampusDesign = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('campus-design');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards, 
          { opacity: 0, y: 30 }, 
          { 
            opacity: 1, y: 0, 
            duration: 0.6, 
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
  const section2Title = data.section2Title ?? DEFAULTS.section2Title;
  const ctaTitle = data.ctaTitle ?? DEFAULTS.ctaTitle;
  const ctaSubtitle = data.ctaSubtitle ?? DEFAULTS.ctaSubtitle;
  const cards: Card[] = (data.cards && data.cards.length > 0) ? data.cards : DEFAULTS.cards;
  const features: string[] = (data.features && data.features.length > 0) ? data.features : DEFAULTS.features;

  return (
    <main className="min-h-screen bg-white">
      {/* Standard Corporate Hero - Side by Side */}
      <section ref={heroRef} className="bg-cm-blue mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] py-6 md:py-8 overflow-hidden relative shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 relative z-10 px-4">
          <div className="lg:w-1/2 text-left text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              {heroTitle}
            </h1>
            <p className="text-sm md:text-base text-white/85 leading-snug max-w-xl">
              {heroSubtitle}
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link to="/request-quote" className="btn-secondary px-6 py-2.5 text-sm font-bold">
                Start Planning
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <img src={heroImage} alt={heroTitle} className="rounded-2xl shadow-xl w-full h-[260px] object-cover border-2 border-cm-blue-dark relative z-10" />
          </div>
        </div>
      </section>

      {/* Structured Masonry Services Grid */}
      <section id="services" className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-cm-blue-dark tracking-tighter">
                {section1Title}
              </h2>
            </div>
            <p className="hidden md:block text-gray-400 font-bold border-l-4 border-cm-blue pl-4 py-1 text-sm">
              Architecture that breeds Innovation.
            </p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((service) => (
              <div 
                key={service.title} 
                className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.28)] border border-slate-200/70 flex flex-col min-h-[360px]"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img src={service.image} alt={service.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent" />
                </div>
                <div className="px-6 pb-6 pt-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-3">{service.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">{service.description}</p>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Architecture</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cm-blue">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Process Strategy */}
      <section className="py-10 bg-cm-blue-dark text-white rounded-[2rem] mx-4 mb-10 overflow-hidden shadow-2xl border-4 border-cm-blue/20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-10 tracking-tighter">The Evolutionary Path</h2>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-center">
              {PROCESS_STEPS.map((step) => (
                <div key={step.title} className="group flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white group-hover:rotate-12 transition-all duration-500 shadow-xl">
                    <step.icon className="w-7 h-7 text-cm-yellow group-hover:text-cm-blue-dark" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-tighter">{step.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed max-w-[200px] font-opensans">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Segment */}
      <section className="py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-cm-gray/30 rounded-[3rem] p-10 md:p-20 shadow-xl overflow-hidden relative border border-cm-gray">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-cm-blue-dark mb-6 leading-tight tracking-tight">{section2Title}</h2>
                <div className="grid grid-cols-1 gap-6 font-opensans">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-6 group">
                      <div className="w-10 h-10 rounded-xl bg-cm-blue/10 flex items-center justify-center group-hover:bg-cm-blue transition-all border border-cm-blue/10">
                        <CheckCircle className="w-6 h-6 text-cm-blue group-hover:text-cm-yellow" />
                      </div>
                      <span className="text-lg text-gray-700 font-bold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative p-4 bg-white rounded-[3rem] shadow-2xl">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Architecture" className="rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branding Call to Action */}
      <section className="py-16 text-center bg-cm-blue-dark text-white rounded-t-[5rem] border-t-8 border-cm-yellow/50">
        <div className="max-w-4xl mx-auto px-6">
           <Building2 className="w-20 h-20 text-cm-yellow mx-auto mb-10 opacity-50" />
           <h2 className="text-4xl md:text-7xl font-bold mb-10 tracking-tighter">{ctaTitle}</h2>
           <p className="text-2xl text-white/70 mb-12 font-bold leading-relaxed font-opensans text-pretty">{ctaSubtitle}</p>
           <Link to="/request-quote" className="btn-secondary px-16 py-5 text-2xl">
             Elevate Your Space
           </Link>
        </div>
      </section>
    </main>
  );
};

export default CampusDesign;
