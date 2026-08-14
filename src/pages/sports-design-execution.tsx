import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const SportsDesign = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 text-slate-800">
      <section ref={heroRef} className="mx-3 mt-4 rounded-[2rem] bg-cm-cyan py-10 sm:py-12 md:py-14 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:mx-6 lg:mx-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sports Design + Execution</h1>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            World-class sports infrastructure design and construction. From courts to stadiums, we deliver excellence.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)]">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-6 sm:p-8 md:p-10 order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-cm-blue-dark mb-6">Sports Services</h2>
                <ul className="space-y-3">
                  {['Court Design', 'Surface Installation', 'Equipment Supply', 'Maintenance'].map((s) => (
                    <li key={s} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <CheckCircle className="w-6 h-6 text-cm-cyan flex-shrink-0" />
                      <span className="text-base text-slate-700">{s}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/request-quote" className="btn-primary inline-flex items-center gap-2 mt-8">
                  Get Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="p-4 sm:p-6 md:p-8 order-1 md:order-2">
                <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sports" className="h-[300px] sm:h-[380px] w-full rounded-[1.5rem] object-cover shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SportsDesign;
