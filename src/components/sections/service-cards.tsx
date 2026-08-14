import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/contexts/SiteContentContext';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem { title: string; bgColor: string; textColor: string; href: string; }

const defaultServices: ServiceItem[] = [
  { title: 'Furniture Design+ Supply', bgColor: '#ef4444', textColor: '#ffffff', href: '/furniture' },
  { title: 'Campus Design+ Execution', bgColor: '#8fe635', textColor: '#000000', href: '/campus-design' },
  { title: 'Sports Design+ Execution', bgColor: '#0eb7d8', textColor: '#ffffff', href: '/sports-infra' },
  { title: 'AI/Digital Design+ Supply', bgColor: '#a450e8', textColor: '#ffffff', href: '/digital-transformation' },
];

const ServiceCards = () => {
  const { content } = useSiteContent();
  const services: ServiceItem[] = content.home_services || defaultServices;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (!cards) return;

      const directions = ['-100%', '100%', '100%', '100%'];
      const axes = ['x', 'y', 'y', 'x'];

      Array.from(cards).forEach((card, i) => {
        gsap.fromTo(
          card,
          { [axes[i] as any]: directions[i], opacity: 0 },
          {
            [axes[i] as any]: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
        const text = card.querySelector('h3');
        if (text) {
          gsap.fromTo(text, { y: 20, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.4, delay: 0.3 + i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          });
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div ref={cardsRef} className="flex w-full border-t border-b border-slate-200/70 overflow-hidden">
        {services.map(({ title, bgColor, textColor, href }) => (
          <Link
            key={title}
            to={href}
            className="service-card group flex-1 min-h-[170px] sm:min-h-[180px] lg:min-h-[190px] transition-all duration-300 hover:brightness-[0.98]"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <div className="flex h-full w-full flex-col items-start justify-center px-5 sm:px-6 lg:px-8 py-5 text-left gap-6">
              <h3 className="max-w-[16ch] text-[1.7rem] sm:text-[2rem] lg:text-[2.2rem] font-black uppercase leading-[0.95] tracking-[-0.04em] drop-shadow-[0_1px_0_rgba(0,0,0,0.12)] group-hover:translate-x-0.5 transition-transform duration-300">
                {title}
              </h3>

              <span className="inline-flex items-center gap-2 text-[0.72rem] sm:text-[0.8rem] font-bold uppercase tracking-[0.14em] opacity-95">
                Explore <span className="text-lg sm:text-xl leading-none">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;

