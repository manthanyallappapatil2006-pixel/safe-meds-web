import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Video,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FormField } from '../components/FormField';
import { validateAppointmentForm } from '../utils/validation';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const { doctors, user, appointments, bookAppointment } = useApp();
  const navigate = useNavigate();

  const doctor = doctors.find((d) => d.id === doctorId);

  // Form State
  const [formData, setFormData] = useState({
    doctorId: doctorId || '',
    patientName: user?.name || '',
    contactNumber: user?.phone || '',
    email: user?.email || '',
    appointmentType: doctor?.consultationTypes[0] || 'In-person consultation',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow's date default
    appointmentTime: doctor?.availableSlots[0] || '10:00 AM',
    reason: '',
    additionalNotes: '',
    confirmed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Doctor Not Found</h2>
        <p className="text-xs text-slate-500 mb-5">
          Please select a valid doctor from the directory to book an appointment.
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Doctors</span>
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateAppointmentForm(formData, appointments);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const booked = bookAppointment({
        ...formData,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctor,
        specialty: doctor.specialty,
        clinicName: doctor.hospitalName || doctor.clinicName,
        hospitalAddress: doctor.clinicAddress,
        fee: doctor.consultationFee,
        consultationType: formData.appointmentType,
      });
      setIsSubmitting(false);
      navigate('/appointments/confirmation', { state: { appointment: booked } });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          to={`/doctors/${doctor.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {doctor.name}'s Profile</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Doctor Banner */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-100 mb-6">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-200 shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
            }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {doctor.name}
            </h2>
            <p className="text-xs font-semibold text-teal-800">
              {doctor.specialty} • {doctor.experience}
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {doctor.clinicAddress}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">Fee</span>
            <span className="text-base font-black text-slate-900">
              {formatCurrency(doctor.consultationFee)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Patient Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Patient Full Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Full name of patient"
              required
              error={errors.patientName}
            />

            <FormField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              required
              error={errors.contactNumber}
            />
          </div>

          <FormField
            label="Email Address (Optional)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="patient@safemeds.demo"
            error={errors.email}
          />

          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-2">
            2. Appointment Schedule & Type
          </h3>

          {/* Consultation Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Consultation Format <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.consultationTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData((prev) => ({ ...prev, appointmentType: type }))}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    formData.appointmentType === type
                      ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-100'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {type.includes('Online') ? (
                    <Video className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                  )}
                  <span className="text-xs">{type}</span>
                </button>
              ))}
            </div>
            {errors.appointmentType && (
              <p className="text-xs text-red-600 font-medium">{errors.appointmentType}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Appointment Date"
              name="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              error={errors.appointmentDate}
              helperText="Select today or any upcoming date"
            />

            {/* Time Slot Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Available Time Slot <span className="text-red-500">*</span>
              </label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
              >
                {doctor.availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && (
                <p className="text-xs text-red-600 font-medium">{errors.appointmentTime}</p>
              )}
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-2">
            3. Medical Notes (Optional)
          </h3>

          <FormField
            label="Reason for Visit"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g. Mild headache, viral throat symptoms, routine consult"
          />

          <FormField
            label="Additional Notes / Medical History"
            name="additionalNotes"
            type="textarea"
            rows={2}
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="e.g. Any known drug allergies, existing treatments, or special requests."
          />

          {/* Confirmation Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="confirmed"
                checked={formData.confirmed}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span className="text-xs text-slate-600 leading-tight">
                I confirm the accuracy of the provided demonstration appointment information and agree to the consultation schedule.
              </span>
            </label>
            {errors.confirmed && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.confirmed}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <Link
              to={`/doctors/${doctor.id}`}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming Demo Slot...' : 'Confirm Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
