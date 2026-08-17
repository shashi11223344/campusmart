import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import {
  Ruler,
  Armchair,
  Circle,
  Brain,
  Monitor,
  Building2,
  Microscope,
  Users,
  Lightbulb,
} from 'lucide-react';

const categories = [
  { icon: Ruler, label: 'Campus Design', href: '/campus-design' },
  { icon: Armchair, label: 'Furniture', href: '/furniture' },
  { icon: Circle, label: 'Sports Infra', href: '/sports-infra' },
  { icon: Brain, label: 'AI/ML', href: '/ai-ml' },
  { icon: Monitor, label: 'Tech Infra', href: '/tech-infra' },
  { icon: Building2, label: 'Libraries', href: '/libraries' },
  { icon: Microscope, label: 'Labs', href: '/labs' },
  { icon: Users, label: 'Collaboration', href: '/collaboration' },
  { icon: Lightbulb, label: 'Innovation', href: '/innovation' },
];

const CategoryBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        iconsRef.current?.children || [],
        { y: 40, scale: 0.5, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.7, ease: 'back.out(1.7)' }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-gray-100 pb-0 relative z-[60]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={iconsRef}
          className="flex items-center justify-between gap-6 overflow-x-auto min-w-max pt-2 pb-2 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map(({ icon: Icon, label, href }) => (
            <div key={label} className="relative group cursor-pointer">
              <Link to={href} className="flex flex-col items-center justify-center gap-1.5 px-2 hover:text-cm-blue transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl transition-all duration-300 bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-cm-blue">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <span className="text-[10px] md:text-[12px] font-bold whitespace-nowrap text-gray-700 tracking-tight group-hover:text-cm-blue transition-colors uppercase">
                  {label}
                </span>

                {/* Active Underline Indicator */}
                <div className="absolute -bottom-[10px] left-0 w-full h-[3px] bg-cm-yellow transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
