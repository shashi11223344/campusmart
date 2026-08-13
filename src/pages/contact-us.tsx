import { useState } from 'react';
import { Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import api from '@/api/client';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: '',
    authorisedPerson: '',
    address: '',
    coursesOffered: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/contact/enquiry', formData);
      setSubmitted(true);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        collegeName: '',
        authorisedPerson: '',
        address: '',
        coursesOffered: '',
        subject: '', 
        message: '' 
      });
    } catch {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 9966109191\n+91 9866091111',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@campusmart.in\nsupport@campusmart.in',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-cm-blue mx-3 sm:mx-6 lg:mx-8 rounded-[2rem] py-6 mt-4">
        <div className="w-full mx-auto px-2 sm:px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Have a question or need assistance? We're here to help. Reach out to us
            through any of the channels below.
          </p>
        </div>
      </section>

      <div className="w-full mx-auto px-2 sm:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-cm-blue-dark mb-6">
                Send us a Message
              </h2>
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  ✅ Thank you! Your message has been sent. We'll get back to you shortly.
                </div>
              )}
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">College / University Name *</label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="form-input"
                      placeholder="Name of Institution"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Authorised Person *</label>
                    <input
                      type="text"
                      value={formData.authorisedPerson}
                      onChange={(e) => setFormData({ ...formData, authorisedPerson: e.target.value })}
                      className="form-input"
                      placeholder="Principal / Director / HOD"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Full Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-input"
                    placeholder="Physical address of the institution"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Courses Offered</label>
                    <select
                      value={formData.coursesOffered}
                      onChange={(e) => setFormData({ ...formData, coursesOffered: e.target.value })}
                      className="form-input"
                    >
                      <option value="">Select Category</option>
                      <option value="engineering">Engineering</option>
                      <option value="medical">Medical</option>
                      <option value="k12">K-12 School</option>
                      <option value="degree">Degree College</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input min-h-[150px] resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                  <Send className="w-5 h-5" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, title, content }) => (
                <div key={title} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cm-blue/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-cm-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cm-blue-dark mb-2">{title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-500 rounded-xl p-6 mt-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">Chat on WhatsApp</h3>
              </div>
              <p className="text-white/90 mb-4">
                Get instant support through WhatsApp. We're available during business hours.
              </p>
              <a
                href="https://wa.me/919966109191"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Chat
              </a>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};

export default ContactUs;
