import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, Ruler, Trophy, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageData } from '@/hooks/usePageData';

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS = {
    heroTitle: 'Our Services',
    heroSubtitle: 'Comprehensive campus transformation services from master planning to final execution.',
    cards: [
        {
            title: 'Campus Design & Execution',
            description: 'Comprehensive master planning and architectural design services tailoring educational spaces for future-ready learning.',
            href: '/campus-design-execution',
            color: 'bg-blue-600'
        },
        {
            title: 'Furniture Design & Supply',
            description: 'Ergonomic and modular furniture solutions for classrooms, laboratories, libraries, and administrative offices.',
            href: '/furniture-design-supply',
            color: 'bg-cm-green'
        },
        {
            title: 'Sports Design & Execution',
            description: 'Premier sports infrastructure including synthetic tracks, indoor courts, and outdoor recreational areas.',
            href: '/sports-design-execution',
            color: 'bg-cm-yellow'
        },
        {
            title: 'AI/Digital Solutions',
            description: 'Physical and digital integrations including smart classes, AI labs, and digital infrastructure for modern education.',
            href: '/ai-digital-design-supply',
            color: 'bg-purple-600'
        }
    ]
};

const Services = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { data } = usePageData('services');

    const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
    const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;
    const cardList = (data.cards && data.cards.length > 0) ? data.cards : DEFAULTS.cards;

    const iconMap: Record<string, any> = {
        'Campus Design & Execution': Ruler,
        'Furniture Design & Supply': LayoutGrid,
        'Sports Design & Execution': Trophy,
        'AI/Digital Solutions': Cpu
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.service-card', {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%'
                }
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <main className="min-h-screen pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{heroTitle}</h1>
                    <p className="text-xl text-gray-600 max-w-3xl">
                        {heroSubtitle}
                    </p>
                </div>

                <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                    {cardList.map((service: any, i: number) => {
                        const Icon = iconMap[service.title] || Ruler;
                        return (
                            <Link 
                                key={i} 
                                to={service.href} 
                                className="service-card group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex h-full min-h-[260px] w-full gap-6"
                            >
                                <div className="flex h-full w-full items-start gap-6">
                                    <div className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between min-w-0">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cm-blue transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-4">
                                                {service.description}
                                            </p>
                                        </div>
                                        <span className="text-cm-blue font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                            Learn More <span className="text-xl">→</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default Services;
