import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Monitor, Wifi, Server, Shield } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

interface CardItem { title: string; description: string; }

const DEFAULTS = {
  heroTitle: 'Technology Infrastructure',
  heroSubtitle: 'Complete technology infrastructure solutions for modern campuses. From networking to security, we build the foundation for digital learning.',
  heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  section1Title: 'Our Services',
  cards: [
    { title: 'Interactive Displays', description: 'Smart boards and digital displays' },
    { title: 'Network Solutions', description: 'Campus-wide WiFi and networking' },
    { title: 'Server Infrastructure', description: 'On-premise and cloud solutions' },
    { title: 'Cybersecurity', description: 'Complete security solutions' }
  ] as CardItem[]
};

const ICONS = [Monitor, Wifi, Server, Shield];

const TechInfra = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('tech-infra');

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
          </div>
          <div className="lg:w-1/2 relative">
            <img src={heroImage} alt={heroTitle} className="rounded-2xl shadow-xl w-full h-[260px] object-cover border-2 border-cm-blue-dark relative z-10" />
          </div>
        </div>
      </section>

      {/* Structured Nodes Layout */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center mb-10">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-cm-blue-dark mb-4">
                {section1Title}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 font-opensans">
                We design and implement scalable digital foundations that power modern learning. Our expertise ranges from high-speed connectivity to enterprise-grade cloud security.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-cm-gray rounded-xl font-opensans">
                  <div className="text-xl font-bold text-cm-blue mb-1">99.9%</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Typical Uptime</div>
                </div>
                <div className="p-5 bg-cm-gray rounded-xl font-opensans">
                  <div className="text-xl font-bold text-cm-blue mb-1">10Gbps</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Backbone Speed</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img src={heroImage} alt={heroTitle} className="rounded-2xl shadow-xl w-full h-[350px] object-cover" />
            </div>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={card.title} className="group p-8 bg-white border border-slate-200/70 rounded-[2rem] hover:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 flex flex-col items-start shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] min-h-[360px]">
                  <div className="w-16 h-16 bg-cm-blue/5 rounded-2xl flex items-center justify-center mb-6 border border-cm-blue/10 group-hover:bg-cm-blue transition-all duration-500 shadow-inner">
                    <Icon className="w-8 h-8 text-cm-blue group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-cm-blue-dark mb-3 tracking-tighter group-hover:text-cm-blue transition-colors leading-tight">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow">{card.description}</p>
                  <div className="mt-8 pt-6 border-t border-gray-50 w-full flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cm-yellow" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cm-blue-dark/40">Secure Tech</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standard Call to Action */}
      <section className="py-12 bg-cm-blue-dark text-white rounded-[2rem] mx-4 mb-10 overflow-hidden shadow-xl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield className="w-12 h-12 text-cm-yellow mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Foundation for Digital Excellence.</h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
            Join 4000+ campuses trusted by our engineering expertise. We build the architecture that sustains the future of Indian education.
          </p>
          <Link to="/request-quote" className="btn-secondary inline-block px-10 py-3 text-base">
            Get Technical Audit
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TechInfra;
