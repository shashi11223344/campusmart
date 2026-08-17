import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Phone, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PartnershipForm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form container slide in
      gsap.fromTo(
        formRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Form fields stagger
      const formFields = formRef.current?.querySelectorAll('.form-field');
      if (formFields) {
        gsap.fromTo(
          formFields,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Contact info slide in
      gsap.fromTo(
        contactRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Buttons pop in
      const buttons = contactRef.current?.querySelectorAll('.contact-btn');
      if (buttons) {
        gsap.fromTo(
          buttons,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.4,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <section ref={containerRef} className="py-4 md:py-6 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-cm-gray rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-cm-blue-dark mb-2">
              Partnership Enquiry Form
            </h2>
            <p className="text-gray-600 mb-6">
              Please fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-5">
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-cm-red">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input min-h-[120px] resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Enquiry
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div ref={contactRef} className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-cm-blue-dark mb-4">
              Ready to talk?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At Campus Mart, we have the expertise in guiding you to set up your new
              campus project and help you maximize the performance of your campus while
              also figuring out your return on investment. We have the expertise in
              guiding you to set up your new campus project and help you maximize.
            </p>

            <div className="space-y-4">
              <a
                href="https://wa.me/919966109191"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn btn-whatsapp w-full justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Connect On WhatsApp
              </a>

              <a
                href="tel:+919966109191"
                className="contact-btn btn-call w-full justify-center"
              >
                <Phone className="w-5 h-5" />
                Call Us 9966109191
              </a>
            </div>

            <div className="mt-8 p-6 bg-cm-blue/5 rounded-xl">
              <h3 className="font-bold text-cm-blue-dark mb-2">Job Openings</h3>
              <p className="text-gray-600 text-sm mb-3">
                Join with us as Influencers and be part of the campus transformation journey.
              </p>
              <a
                href="#"
                className="text-cm-blue font-semibold text-sm hover:underline"
              >
                View Open Positions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipForm;
