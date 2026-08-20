import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { usePageData } from '@/hooks/usePageData';

const DEFAULTS = {
  heroTitle: 'Partnership Enquiry',
  heroSubtitle: 'Partner with us to transform educational infrastructure.'
};

const Partnership = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', institution: '', message: '' });
  const { data } = usePageData('partnership');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const heroTitle = data.heroTitle ?? DEFAULTS.heroTitle;
  const heroSubtitle = data.heroSubtitle ?? DEFAULTS.heroSubtitle;

  if (submitted) {
    return (
      <main className="min-h-screen bg-cm-gray flex items-center justify-center py-4">
        <div className="bg-white rounded-lg p-8 shadow-sm max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cm-blue-dark mb-4">Thank You!</h2>
          <p className="text-gray-600">We'll contact you soon about partnership opportunities.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cm-gray py-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-cm-blue-dark mb-2 text-center">{heroTitle}</h1>
          <p className="text-gray-600 text-center mb-2">{heroSubtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label">Full Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input type="email" pattern="[^\s@]+@[^\s@]+\.[^\s@]+" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Institution</label>
              <input type="text" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="form-input min-h-[120px]" placeholder="Tell us about your partnership interest..." />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Submit Enquiry
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Partnership;
