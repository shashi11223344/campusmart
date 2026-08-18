import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Download, FileText, BookOpen, ArrowRight } from 'lucide-react';
import api from '@/api/client';
import { usePageData } from '@/hooks/usePageData';

gsap.registerPlugin(ScrollTrigger);

const API_UPLOAD_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

const normalizeCatalogDownload = (value?: string) => {
  if (!value || value === '#') return '';
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${API_UPLOAD_BASE}${value}`;
  return value;
};

const DEFAULTS = {
  heroTitle: 'Product Catalogues',
  heroSubtitle: 'Browse our comprehensive catalogues featuring furniture, equipment, and infrastructure solutions for educational institutions.',
  cards: [
    {
      title: 'NEP READY CLASSROOM FURNITURE',
      description: 'Furniture solutions specifically designed to align with New Education Policy guidelines for modern classrooms.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      downloadLink: '',
      size: '12 MB',
    },
    {
      title: 'SCHOOLMART BRIEF PROFILE [PDF]',
      description: 'An overview of SchoolMart\'s mission, services, and extensive experience in educational infrastructure.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      downloadLink: '',
      size: '5 MB',
    },
    {
      title: 'SCHOOL DESIGN [PDF]',
      description: 'Comprehensive guide on architectural and ergonomic principles for modern school environments.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      downloadLink: '',
      size: '18 MB',
    },
    {
      title: 'CLASSROOM CONFIGURATION IDEAS [PDF]',
      description: 'Creative and functional layout samples for various classroom sizes and learning objectives.',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      downloadLink: '',
      size: '8 MB',
    },
    {
      title: 'MASTER CATALOGUE',
      description: 'Our full range of products including Labs, Libraries, Sports, and AI Stations.',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      downloadLink: '',
      size: '25 MB',
    },
  ],
  caseStudies: [
    {
      title: 'Campus Master Planning',
      description: 'Complete campus transformation for a leading university in Bangalore.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      title: '20 Stunning College Buildings',
      description: 'Showcase of our most innovative campus architecture projects.',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'STEM Lab Implementation',
      description: 'State-of-the-art STEM lab setup for a prestigious school chain.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
  ]
};

const Catalogues = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data } = usePageData('catalogues');
  const [catalogueRows, setCatalogueRows] = useState<any[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let active = true;

    api.get('/catalogues')
      .then((res) => {
        if (!active) return;
        const mapped = (Array.isArray(res.data) ? res.data : []).map((catalogue: any) => ({
          title: catalogue.title,
          description: catalogue.description || 'Download the catalogue PDF.',
          image: catalogue.thumbnailUrl || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
          downloadLink: normalizeCatalogDownload(catalogue.fileUrl),
          size: 'PDF',
        }));
        setCatalogueRows(mapped);
      })
      .catch(() => {
        if (active) setCatalogueRows([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;
  const catalogues = catalogueRows.length > 0
    ? catalogueRows
    : ((data.cards && data.cards.length > 0)
      ? data.cards.map((catalogue: any) => ({
          ...catalogue,
          downloadLink: normalizeCatalogDownload(catalogue.downloadLink ?? catalogue.fileUrl),
        }))
      : DEFAULTS.cards);
  const caseStudies = (data.caseStudies && data.caseStudies.length > 0) ? data.caseStudies : DEFAULTS.caseStudies;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-cm-blue mx-3 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-32 rounded-[2rem] py-6 mt-4">
        <div className="w-full mx-auto px-6 sm:px-8 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Catalogues Grid */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-cm-blue-dark mb-8 md:mb-12 text-center">
            Download Our Catalogues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {catalogues.map((catalogue: any) => {
              const hasDownload = Boolean(catalogue.downloadLink);

              return (
                <div
                  key={catalogue.title}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-cm-blue/20"
                >
                  <div className="h-56 overflow-hidden bg-gray-100">
                    <img
                      src={catalogue.image}
                      alt={catalogue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-cm-blue" />
                      <span className="text-xs font-semibold text-cm-blue uppercase tracking-wider">{catalogue.size || 'PDF'}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-cm-blue-dark mb-3 line-clamp-2">
                      {catalogue.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base mb-6 line-clamp-3">{catalogue.description}</p>
                    {hasDownload ? (
                      <a
                        href={catalogue.downloadLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-cm-blue text-white font-semibold rounded-lg hover:bg-cm-blue-dark transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        PDF Unavailable
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-cm-blue-dark mb-4 text-center">
            Case Studies & Projects
          </h2>
          <p className="text-gray-600 text-center text-base md:text-lg max-w-3xl mx-auto mb-10 md:mb-12">
            Explore our completed projects and see how we've transformed educational institutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {caseStudies.map((study: any) => (
              <div
                key={study.title}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cm-blue/20"
              >
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-cm-blue" />
                    <span className="text-xs font-semibold text-cm-blue uppercase tracking-wider">Case Study</span>
                  </div>
                  <h3 className="text-lg font-bold text-cm-blue-dark mb-3">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{study.description}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-2 text-cm-blue font-semibold text-sm hover:text-cm-blue-dark transition-colors duration-200"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-32 bg-cm-yellow">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cm-blue-dark mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Our team can create customized catalogues based on your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request-quote" className="btn-primary">
              Request Custom Catalogue
            </Link>
            <Link to="/contact-us" className="bg-white text-cm-blue-dark px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Catalogues;
