import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  Send,
  Home,
  FileQuestion,
  BookOpen,
  PhoneCall
} from 'lucide-react';
import { FormField } from '../components/FormField';
import { faqsList } from '../data/initialData';
import { validateSupportForm } from '../utils/validation';
import { useApp } from '../context/AppContext';

export const Help = () => {
  const { user } = useApp();
  const [expandedFaq, setExpandedFaq] = useState(0);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    topic: 'Doctor Appointments',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateSupportForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        topic: 'Doctor Appointments',
        subject: '',
        message: ''
      });
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 700);
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      topic: 'Doctor Appointments',
      subject: '',
      message: ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          Help & Demonstration Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to navigate the Safe Meds healthcare prototype for college presentation
        </p>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-teal-700" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Form Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-700" />
              <span>Submit Demonstration Feedback</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated inquiries & feedback submission for academic review
            </p>
          </div>
        </div>

        {isSubmitted && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 mb-5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Demo Inquiry Submitted!</p>
              <p className="text-emerald-700">
                Your message was simulated successfully. (In this college demo, no external email server is contacted).
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              error={errors.name}
            />

            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. reviewer@college.edu"
              required
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Topic Category <span className="text-red-500">*</span>
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
              >
                <option value="Doctor Appointments">Doctor Appointments</option>
                <option value="Pharmacy & Medicine Delivery">Pharmacy & Medicine Delivery</option>
                <option value="Prescription Verification">Prescription Verification</option>
                <option value="Emergency SOS Simulation">Emergency SOS Simulation</option>
                <option value="General Prototype Feedback">General Prototype Feedback</option>
              </select>
            </div>

            <FormField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Short title of inquiry"
              required
              error={errors.subject}
            />
          </div>

          <FormField
            label="Message Details"
            name="message"
            type="textarea"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your questions or feedback regarding the Safe Meds prototype..."
            required
            error={errors.message}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Clear Form
            </button>

            <div className="flex items-center gap-3">
              <Link
                to="/home"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Back to Home
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Submit Demo Feedback'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
