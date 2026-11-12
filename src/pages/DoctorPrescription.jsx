
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Save, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DoctorPrescription = () => {
  const { appointmentId, prescriptionId } = useParams();
  const navigate = useNavigate();

 const {
    user,
    appointments = [],
    prescriptions = [],
    submitPrescription,
    updatePrescription,
} = useApp();

 const existingPrescription = prescriptions.find(
    (rx) =>
        rx.id === prescriptionId &&
        rx.type === 'doctor-issued' &&
        rx.doctorId === user?.doctorId
);

const appointment = appointments.find(
    (item) =>
        item.id === (appointmentId || existingPrescription?.appointmentId) &&
        item.doctorId === user?.doctorId
);

  const [details, setDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (existingPrescription) {
        setDetails(existingPrescription.prescriptionDetails || '');
        setNotes(existingPrescription.notes || '');
    }
}, [existingPrescription]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!details.trim()) {
        setError('Please enter prescription details.');
        return;
    }

    if (prescriptionId) {
        if (!existingPrescription) {
            setError('Prescription not found or access denied.');
            return;
        }

        const updated = updatePrescription(prescriptionId, {
            prescriptionDetails: details.trim(),
            notes: notes.trim(),
        });

        if (!updated) {
            setError('Unable to update prescription.');
            return;
        }
    } else {
        if (!appointment) {
            setError('Appointment not found.');
            return;
        }

        submitPrescription({
            type: 'doctor-issued',
            doctorId: user.doctorId,
            doctorName: user.name,
            patientId: appointment.patientId || null,
            patientName: appointment.patientName,
            patientEmail: appointment.email || '',
            appointmentId: appointment.id,
            prescriptionDetails: details.trim(),
            notes: notes.trim(),
        });
    }

    navigate('/doctor-dashboard', { replace: true });
};
if (!appointment || (prescriptionId && !existingPrescription)) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <AlertCircle className="mx-auto text-amber-600 mb-3" size={36} />
        <h2 className="text-xl font-bold text-slate-900">
          Appointment not found
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          This appointment may not belong to your doctor account.
        </p>
        <Link
          to="/doctor-dashboard"
          className="inline-block mt-5 text-teal-700 font-semibold"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/doctor-dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
            <FileText className="text-teal-700" size={24} />
          </div>
          <div>
           <h1 className="text-2xl font-black text-slate-900">
    {prescriptionId ? 'Edit Prescription' : 'Create Prescription'}
</h1>
<p className="text-sm text-slate-500">
    {prescriptionId
        ? 'Review and update the existing prescription.'
        : 'Record the prescription for this appointment.'}
</p>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
        <h2 className="font-bold text-teal-950 mb-3">
          Appointment Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-teal-700">Patient</p>
            <p className="font-semibold text-teal-950">
              {appointment.patientName}
            </p>
          </div>
          <div>
            <p className="text-teal-700">Appointment ID</p>
            <p className="font-semibold text-teal-950">
              {appointment.id}
            </p>
          </div>
          <div>
            <p className="text-teal-700">Date</p>
            <p className="font-semibold text-teal-950">
              {appointment.date || 'Not available'}
            </p>
          </div>
          <div>
            <p className="text-teal-700">Doctor</p>
            <p className="font-semibold text-teal-950">
              {user.name}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5"
      >
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Prescription Details
          </label>
          <textarea
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setError('');
            }}
            rows={7}
            placeholder="Enter the prescription details..."
            className="w-full rounded-xl border border-slate-300 p-4 text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
            required
          />
          <p className="text-xs text-slate-400 mt-2">
            For authorized clinician use. This field records information;
            it does not validate prescriptions or medication safety.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Optional consultation notes..."
            className="w-full rounded-xl border border-slate-300 p-4 text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
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
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white py-3 font-bold text-sm"
        >
          <Save size={18} />
          Save Prescription
        </button>
      </form>
    </div>
  );
};

export default DoctorPrescription;
