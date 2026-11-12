
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  CalendarDays,
  ClipboardList,
  Clock,
  LogOut,
  UserRound,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DoctorDashboard = () => {
  const {
    user,
    doctors,
    appointments = [],
    prescriptions = [],
    logout,
  } = useApp();

  const navigate = useNavigate();

  // Show only appointments assigned to this doctor.
  const doctorAppointments = appointments.filter(
    (appointment) =>
      String(appointment.doctorId || '').trim().toLowerCase() ===
      String(user?.doctorId || '').trim().toLowerCase()
  );

  // Show only prescriptions issued by this doctor.
  const doctorPrescriptions = prescriptions.filter(
    (rx) =>
      rx.type === 'doctor-issued' &&
      String(rx.doctorId || '').trim().toLowerCase() ===
      String(user?.doctorId || '').trim().toLowerCase()
  );



  const upcomingAppointments = doctorAppointments.filter(
    (appointment) =>
      !['Completed', 'Cancelled', 'Rejected'].includes(
        appointment.status
      )
  );

  const handleLogout = async () => {
    await logout();
    navigate('/doctor-login', { replace: true });
  };

  const doctorProfile = doctors.find(
    (doctor) => doctor.id === user?.doctorId
  );

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-800 to-cyan-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-teal-100 text-sm mb-3">
              <Stethoscope size={18} />
              Doctor Workspace
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {user?.name || 'Doctor'}
            </h1>

            <p className="text-teal-100 text-sm mt-2">
              Manage your appointments and patient consultations.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-3 text-sm font-semibold"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      {/* Doctor information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
            <UserRound className="text-teal-700" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Doctor Profile
            </h2>
            <p className="text-xs text-slate-500">
              Your registered demo profile
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Doctor Name</p>
            <p className="font-semibold text-slate-900">
              {doctorProfile?.name || user?.name}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Doctor ID</p>
            <p className="font-semibold text-slate-900">
              {user?.doctorId}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Specialty</p>
            <p className="font-semibold text-slate-900">
              {doctorProfile?.specialty || 'Not available'}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Clinic</p>
            <p className="font-semibold text-slate-900">
              {doctorProfile?.hospitalName || 'Not available'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Appointments
            </p>
            <CalendarDays className="text-teal-700" size={20} />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">
            {doctorAppointments.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Upcoming
            </p>
            <Clock className="text-teal-700" size={20} />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">
            {upcomingAppointments.length}
          </p>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              My Appointments
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Appointments assigned to your doctor profile
            </p>
          </div>

          <ClipboardList className="text-teal-700" />
        </div>

        {doctorAppointments.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarDays
              size={36}
              className="mx-auto text-slate-300 mb-3"
            />
            <h3 className="font-bold text-slate-800">
              No appointments yet
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Your appointments will appear here when patients book with you.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {doctorAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    {appointment.patientName || 'Patient'}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {appointment.date || 'Date not available'}
                    {' · '}
                    {appointment.time || 'Time not available'}
                  </p>

                  <p className="text-sm text-slate-600 mt-1">
                    {appointment.reason || appointment.symptoms || 'Consultation'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-teal-50 text-teal-800 px-3 py-1 text-xs font-semibold">
                    {appointment.status || 'Upcoming'}
                  </span>

                  <div className="flex items-center gap-3">
  <Link
    to="/appointments"
    className="text-sm font-semibold text-teal-700 hover:text-teal-900"
  >
    View
  </Link>

  <Link
    to={`/doctor-prescription/${appointment.id}`}
    className="text-sm font-semibold bg-teal-700 hover:bg-teal-800 text-white px-3 py-2 rounded-lg"
  >
    Create Prescription
  </Link>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription workspace notice */}
     {/* Doctor Issued Prescriptions */}
<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
            <h2 className="font-bold text-slate-900">
                Issued Prescriptions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
                View and edit prescriptions issued by you.
            </p>
        </div>

        <FileText className="text-teal-700" />
    </div>

    {doctorPrescriptions.length === 0 ? (
        <div className="p-8 text-center">
            <FileText
                size={36}
                className="mx-auto text-slate-300 mb-3"
            />
            <h3 className="font-bold text-slate-800">
                No prescriptions issued yet
            </h3>
            <p className="text-sm text-slate-500 mt-1">
                Prescriptions you create will appear here.
            </p>
        </div>
    ) : (
        <div className="divide-y divide-slate-100">
            {doctorPrescriptions.map((rx) => (
                <div
                    key={rx.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-900">
                            {rx.patientName || 'Patient'}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            Issued: {rx.date || 'Date unavailable'}
                        </p>

                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                            {rx.prescriptionDetails}
                        </p>

                        <span className="inline-block mt-2 rounded-full bg-teal-50 text-teal-800 px-3 py-1 text-xs font-semibold">
                            {rx.demoStatus || 'Issued'}
                        </span>
                    </div>

                    <Link
                        to={`/doctor-prescription/edit/${rx.id}`}
                        className="shrink-0 text-sm font-semibold bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-center"
                    >
                        Edit Prescription
                    </Link>
                </div>
            ))}
        </div>
    )}
</div>

      <p className="text-xs text-slate-400 text-center">
        Development login only. Real doctor authentication and patient-data
        access must be secured through the backend before real-world use.
      </p>
        </div>
  );
};

export default DoctorDashboard;