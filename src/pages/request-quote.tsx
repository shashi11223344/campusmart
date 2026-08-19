import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import api from '@/api/client';

const RequestQuote = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: '',
    authorisedPerson: '',
    address: '',
    pincode: '',
    requirement: '',
    budget: '',
    timeline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/contact/quote', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        institution: formData.collegeName,
        items: `Authorised Person: ${formData.authorisedPerson}\nPincode: ${formData.pincode}\nBudget: ${formData.budget || 'Not specified'}\nTimeline: ${formData.timeline || 'Not specified'}`,
        message: `Address: ${formData.address}\nRequirements: ${formData.requirement}`,
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-cm-gray flex items-center justify-center py-4">
        <div className="bg-white rounded-lg p-8 shadow-sm max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cm-blue-dark mb-4">Quote Request Submitted!</h2>
          <p className="text-gray-600">We'll get back to you within 24 hours.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cm-gray py-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-cm-blue-dark mb-2 text-center">Request a Quote</h1>
          <p className="text-gray-600 text-center mb-2">Tell us about your requirements and we'll get back to you.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">College / University Name *</label>
                <input type="text" value={formData.collegeName} onChange={(e) => setFormData({...formData, collegeName: e.target.value})} className="form-input" placeholder="Name of Institution" required />
              </div>
              <div>
                <label className="form-label">Authorised Person *</label>
                <input type="text" value={formData.authorisedPerson} onChange={(e) => setFormData({...formData, authorisedPerson: e.target.value})} className="form-input" placeholder="Principal / Director" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input" placeholder="Your name" required />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Phone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="form-input" placeholder="+91" required />
              </div>
              <div>
                <label className="form-label">Pincode *</label>
                <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="form-input" placeholder="6-digit pincode" required />
              </div>
            </div>
            <div>
              <label className="form-label">Full Address *</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="form-input" placeholder="Physical location of institution" required />
            </div>
            <div>
              <label className="form-label">Requirements *</label>
              <textarea value={formData.requirement} onChange={(e) => setFormData({...formData, requirement: e.target.value})} className="form-input min-h-[120px]" placeholder="Describe your requirements..." required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Budget Range</label>
                <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="form-input">
                  <option value="">Select budget</option>
                  <option value="under-1l">Under ₹1 Lakh</option>
                  <option value="1-5l">₹1-5 Lakhs</option>
                  <option value="5-10l">₹5-10 Lakhs</option>
                  <option value="10-50l">₹10-50 Lakhs</option>
                  <option value="above-50l">Above ₹50 Lakhs</option>
                </select>
              </div>
              <div>
                <label className="form-label">Timeline</label>
                <select value={formData.timeline} onChange={(e) => setFormData({...formData, timeline: e.target.value})} className="form-input">
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate</option>
                  <option value="1-3m">1-3 Months</option>
                  <option value="3-6m">3-6 Months</option>
                  <option value="6-12m">6-12 Months</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              <Send className="w-5 h-5" />
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default RequestQuote;
