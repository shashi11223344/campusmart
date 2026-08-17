import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Video, Presentation } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

interface CardItem { title: string; description: string; image?: string; }

const DEFAULTS = {
  heroTitle: 'Collaboration Spaces',
  heroSubtitle: 'Foster teamwork and innovation with purpose-built collaboration spaces. Designed for modern learning and working styles.',
  heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  section1Title: 'Collaboration Features',
  cards: [
    { title: 'Collaborative Spaces', description: 'Designed for teamwork and group projects', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Discussion Rooms', description: 'Private spaces for focused conversations', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Video Conferencing', description: 'Connect with remote participants seamlessly', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { title: 'Presentation Areas', description: 'Equipped for effective presentations', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
  ] as CardItem[]
};

const ICONS = [Users, MessageSquare, Video, Presentation];

const Collaboration = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('collaboration');

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
      <section ref={heroRef} className="bg-cm-blue py-10 md:py-14 mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] my-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-opensans">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Structured Synergy Features */}
      <section className="py-10 md:py-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center mb-10">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-4xl font-bold text-cm-blue-dark mb-6 leading-tight tracking-tight">Synergy isn't just a Buzzword.</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-cm-blue pl-6 py-2 font-opensans">
                We believe that the best ideas are born in the friction between diverse minds. Our spaces are engineered to facilitate those collisions—making innovation inevitable.
              </p>
              <div className="flex flex-wrap gap-8 font-opensans">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-cm-blue">4.5x</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Interaction Boost</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-cm-yellow">100%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">User Engagement</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-2 bg-cm-blue/5 rounded-3xl blur-md" />
              <img src={heroImage} alt="Collaboration" className="relative rounded-2xl shadow-xl w-full h-[380px] object-cover" />
            </div>
          </div>

          {/* Staggered Vertical Card Layout */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-cm-blue-dark tracking-tighter mb-8">
              {section1Title}
            </h2>
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <div key={card.title} className="group bg-white border border-slate-200/70 rounded-[2rem] hover:shadow-[0_30px_80px_-20px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 flex flex-col shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] min-h-[360px] overflow-hidden">
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <img src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent" />
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-cm-blue group-hover:scale-110 transition-all duration-500">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-3">{card.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">{card.description}</p>
                      <div className="flex items-center justify-between text-slate-700">
                         <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Collaboration</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Balanced Call to Action */}
      <section className="py-16 bg-cm-gray/30 rounded-[3rem] mx-4 mb-12 text-center border border-cm-gray shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <MessageSquare className="w-16 h-16 text-cm-blue mx-auto mb-8 opacity-50" />
          <h2 className="text-4xl md:text-6xl font-bold text-cm-blue-dark mb-10 tracking-tighter">Start the Conversation.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact-us" className="btn-primary px-16 py-5 text-xl">
              Connect With Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Collaboration;
