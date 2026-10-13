import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { formatCurrency, formatDate } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const Appointments = () => {
  const { appointments, cancelAppointment, rescheduleAppointment, doctors } = useApp();

  const [activeTab, setActiveTab] = useState('Upcoming'); // 'Upcoming' | 'Completed' | 'Cancelled'

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [rescheduleData, setRescheduleData] = useState({
    id: null,
    newDate: '',
    newTime: ''
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const [cancelData, setCancelData] = useState({
    id: null,
    reason: 'Schedule conflict'
  });
  const [showCancelModal, setShowCancelModal] = useState(false);

  const filteredAppointments = appointments.filter((a) => a.status === activeTab);

  // Open Details
  const handleOpenDetails = (apt) => {
    setSelectedAppointment(apt);
    setShowDetailsModal(true);
  };

  // Open Reschedule
  const handleOpenReschedule = (apt) => {
    const doc = doctors.find((d) => d.id === apt.doctorId);
    setRescheduleData({
      id: apt.id,
      doctor: doc,
      newDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      newTime: doc?.availableSlots[0] || '11:00 AM'
    });
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) return;
    rescheduleAppointment(rescheduleData.id, rescheduleData.newDate, rescheduleData.newTime);
    setShowRescheduleModal(false);
  };

  // Open Cancel
  const handleOpenCancel = (apt) => {
    setCancelData({
      id: apt.id,
      doctorName: apt.doctorName,
      reason: 'Schedule conflict / change in plans'
    });
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    cancelAppointment(cancelData.id, cancelData.reason);
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title & Booking Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Manage your consultations, reschedule times, or cancel demo bookings
          </p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Book New Doctor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs: Upcoming / Completed / Cancelled */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {['Upcoming', 'Completed', 'Cancelled'].map((tab) => {
          const count = appointments.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === tab
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab.toLowerCase()} appointments`}
          description={`You do not have any consultations categorized under "${activeTab}".`}
          actionText={activeTab === 'Upcoming' ? 'Browse Specialists' : undefined}
          onAction={activeTab === 'Upcoming' ? () => window.location.href = '#/doctors' : undefined}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      Ref #{apt.id}
                    </span>
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      {apt.specialty}
                    </span>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>

                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Patient: <span className="font-semibold text-slate-700">{apt.patientName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Fee</span>
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(apt.fee)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{formatDate(apt.appointmentDate)} at {apt.appointmentTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    {apt.consultationType.includes('Online') ? (
                      <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span>{apt.consultationType}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenDetails(apt)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  View Details
                </button>

                {apt.status === 'Upcoming' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReschedule(apt)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenCancel(apt)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  Appointment Reference
                </span>
                <span className="text-sm font-black text-slate-900">
                  #{selectedAppointment.id}
                </span>
              </div>
              <StatusBadge status={selectedAppointment.status} />
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{selectedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Specialty:</span>
                <span className="font-semibold text-teal-800">{selectedAppointment.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-800">{selectedAppointment.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled:</span>
                <span className="font-bold text-slate-900">
                  {formatDate(selectedAppointment.appointmentDate)} at {selectedAppointment.appointmentTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Format:</span>
                <span className="font-semibold text-slate-800">{selectedAppointment.consultationType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Consultation Fee:</span>
                <span className="font-black text-slate-900">{formatCurrency(selectedAppointment.fee)}</span>
              </div>
            </div>

            {selectedAppointment.reason && (
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Reason for Visit:</span>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  {selectedAppointment.reason}
                </p>
              </div>
            )}

            {selectedAppointment.notes && (
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Special Instructions:</span>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        title="Reschedule Appointment"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Select a new available date and time slot for your consultation with{' '}
            <strong>{rescheduleData.doctor?.name || 'the specialist'}</strong>.
          </p>

          <FormField
            label="New Appointment Date"
            name="newDate"
            type="date"
            value={rescheduleData.newDate}
            onChange={(e) =>
              setRescheduleData((prev) => ({ ...prev, newDate: e.target.value }))
            }
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              New Time Slot <span className="text-red-500">*</span>
            </label>
            <select
              value={rescheduleData.newTime}
              onChange={(e) =>
                setRescheduleData((prev) => ({ ...prev, newTime: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
            >
              {(rescheduleData.doctor?.availableSlots || ['10:00 AM', '02:00 PM', '04:30 PM']).map(
                (slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRescheduleModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Keep Original
            </button>
            <button
              type="button"
              onClick={handleConfirmReschedule}
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Appointment Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Appointment"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to cancel your consultation with{' '}
            <strong>{cancelData.doctorName}</strong>?
          </p>

          <FormField
            label="Reason for Cancellation"
            name="cancelReason"
            value={cancelData.reason}
            onChange={(e) =>
              setCancelData((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="e.g. Schedule clash, no longer needed"
          />

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Keep Appointment
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
