import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Globe, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { FormField } from '../components/FormField';
import { isValidEmail, isValidPhone } from '../utils/validation';
import { useApp } from '../context/AppContext';

export const EditProfile = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    profileImage: user?.profileImage || '',
    preferredLanguage: user?.preferredLanguage || 'English'
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      navigate('/profile');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 mb-1">
          Edit Profile Information
        </h1>
        <p className="text-xs text-slate-500 mb-6 pb-3 border-b border-slate-100">
          Update your patient demo profile details and avatar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Select Profile Avatar
            </label>
            <div className="flex items-center gap-3">
              {sampleAvatars.map((avUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData((prev) => ({ ...prev, profileImage: avUrl }))}
                  className={`relative rounded-2xl overflow-hidden p-0.5 cursor-pointer transition-all ${
                    formData.profileImage === avUrl
                      ? 'ring-3 ring-teal-600 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avUrl} alt="Avatar option" className="w-12 h-12 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={errors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />

            <FormField
              label="Mobile Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="City / Region"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Noida, Delhi"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/profile"
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
