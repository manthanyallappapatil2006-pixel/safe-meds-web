
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DoctorLogin = () => {
  const { doctors, login } = useApp();
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDoctor = doctors.find(
      (doctor) =>
        doctor.id.toLowerCase() === doctorId.trim().toLowerCase()
    );

    if (!selectedDoctor) {
      setError('Doctor ID not found. Please check the ID.');
      return;
    }

    login({
      id: selectedDoctor.id,
      doctorId: selectedDoctor.id,
      name: selectedDoctor.name,
      email: '',
      role: 'doctor',
      isGuest: false,
    });

    navigate('/doctor-dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 mb-7"
        >
          <ArrowLeft size={16} />
          Back to Patient Login
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-5">
          <Stethoscope className="text-teal-700" size={28} />
        </div>

        <h1 className="text-2xl font-black text-slate-900">
          Doctor Login
        </h1>

        <p className="text-sm text-slate-500 mt-2 mb-6">
          Access your appointments and prescription workspace.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-5">
          <strong>Development access:</strong> This temporary login
          uses fictional sample doctor profiles. It does not verify
          medical registration or provide secure authentication.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Doctor ID
            </label>

            <input
              type="text"
              value={doctorId}
              onChange={(e) => {
                setDoctorId(e.target.value);
                setError('');
              }}
              placeholder="Example: DOC-DEMO-1-001"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 text-white py-3 font-bold text-sm"
          >
            Continue to Doctor Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
