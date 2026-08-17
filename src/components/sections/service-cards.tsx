import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { Building2, Sofa, Trophy, Zap, Cpu, BookOpen, Beaker, Lightbulb } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem { title: string; description?: string; href: string; icon?: any; }

const defaultServices: ServiceItem[] = [
  { title: 'Campus Design', description: 'Planning & execution', href: '/campus-design', icon: Building2 },
  { title: 'Furniture', description: 'Learning & workspaces', href: '/furniture', icon: Sofa },
  { title: 'Sports Infra', description: 'Sports & wellness', href: '/sports-infra', icon: Trophy },
  { title: 'AI / Digital', description: 'Smart campus technology', href: '/digital-transformation', icon: Zap },
  { title: 'Tech Infra', description: 'Connected infrastructure', href: '/tech-infra', icon: Cpu },
  { title: 'Libraries', description: 'Modern knowledge spaces', href: '/libraries', icon: BookOpen },
  { title: 'Labs', description: 'Future-ready labs', href: '/labs', icon: Beaker },
  { title: 'Innovation', description: 'Creative ecosystems', href: '/contact-us', icon: Lightbulb },
];

const ServiceCards = () => {
  const { content } = useSiteContent();
  const services: ServiceItem[] = content.home_services ? 
    (Array.isArray(content.home_services) ? content.home_services : defaultServices) : 
    defaultServices;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.service-card');
      if (!cards) return;

      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <div className="text-sm md:text-base font-black uppercase tracking-widest text-blue-600 mb-3">Start your campus journey</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900 mb-4">Choose what you need</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl">Find the right starting point for your institution, project, or campus transformation.</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {services.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              to={href}
              className="service-card group bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
            >
              {Icon && (
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;

