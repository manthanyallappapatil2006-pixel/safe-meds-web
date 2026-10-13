import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Pill,
  ShoppingBag,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const MedicineReminders = () => {
  const {
    medicineReminders,
    addMedicineReminder,
    updateMedicineReminder,
    deleteMedicineReminder,
    toggleReminderStatus,
    takeMedicineDose
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '1 Tablet',
    timeOfDay: '09:00 AM',
    mealTiming: 'After Food',
    frequency: 'Daily',
    remainingDoses: 30,
    refillAlertThreshold: 5
  });
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingReminder(null);
    setFormData({
      medicineName: '',
      dosage: '1 Tablet',
      timeOfDay: '09:00 AM',
      mealTiming: 'After Food',
      frequency: 'Daily',
      remainingDoses: 30,
      refillAlertThreshold: 5
    });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (rem) => {
    setEditingReminder(rem);
    setFormData({ ...rem });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.medicineName.trim()) errs.medicineName = 'Medicine name is required';
    if (!formData.dosage.trim()) errs.dosage = 'Dosage instruction is required';
    if (!formData.timeOfDay.trim()) errs.timeOfDay = 'Reminder time is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (editingReminder) {
      updateMedicineReminder({ ...formData, id: editingReminder.id });
    } else {
      addMedicineReminder(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Medicine Reminders & Refill Alerts
            </h1>
            <span className="text-[11px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              Pill Tracker
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Never miss a dose: schedule timings, track pill counts, and receive automatic refill warnings
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminder Cards Grid */}
      {medicineReminders.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No medication reminders set"
          description="Add your daily tablets, syrups, or vitamins to stay on track with your healthcare schedule."
          actionText="Create First Reminder"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicineReminders.map((rem) => {
            const isLowStock = (rem.remainingDoses || 0) <= (rem.refillAlertThreshold || 5);

            return (
              <div
                key={rem.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between ${
                  !rem.isActive
                    ? 'border-slate-200 opacity-60'
                    : isLowStock
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-teal-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {rem.medicineName}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {rem.dosage} • {rem.mealTiming}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleReminderStatus(rem.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                        rem.isActive
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {rem.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      <span className="font-semibold">{rem.timeOfDay}</span>
                    </div>
                    <div className="text-right text-slate-500">
                      Freq: <strong>{rem.frequency}</strong>
                    </div>
                  </div>

                  {/* Stock Tracker & Refill Alert */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Pills remaining:</span>
                      <span className={`font-black ${isLowStock ? 'text-amber-700' : 'text-slate-900'}`}>
                        {rem.remainingDoses} doses
                      </span>
                    </div>

                    {isLowStock && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Refill Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rem)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                      title="Edit reminder"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedicineReminder(rem.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded-lg cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLowStock && (
                      <Link
                        to="/medicines"
                        className="px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-50 rounded-lg flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Reorder</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => takeMedicineDose(rem.id)}
                      disabled={rem.remainingDoses <= 0}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Take Dose</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Reminder Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingReminder ? 'Edit Medication Reminder' : 'Set Medication Reminder'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Medicine Name"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            placeholder="e.g. Paracetamol 650mg, Amlodipine 5mg"
            required
            error={errors.medicineName}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g. 1 Tablet, 5ml Syrup"
              required
              error={errors.dosage}
            />

            <FormField
              label="Reminder Time"
              name="timeOfDay"
              value={formData.timeOfDay}
              onChange={handleChange}
              placeholder="e.g. 08:30 AM"
              required
              error={errors.timeOfDay}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Meal Timing
              </label>
              <select
                name="mealTiming"
                value={formData.mealTiming}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="After Food">After Food</option>
                <option value="Before Food">Before Food (Empty Stomach)</option>
                <option value="With Food">With Food</option>
                <option value="At Bedtime">At Bedtime</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Daily">Daily</option>
                <option value="Twice a Day">Twice a Day</option>
                <option value="Weekly">Weekly</option>
                <option value="SOS / As needed">SOS / As needed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Total Pill Count / Doses"
              name="remainingDoses"
              type="number"
              value={formData.remainingDoses}
              onChange={handleChange}
              placeholder="e.g. 30"
            />

            <FormField
              label="Refill Alert Trigger"
              name="refillAlertThreshold"
              type="number"
              value={formData.refillAlertThreshold}
              onChange={handleChange}
              placeholder="e.g. 5"
              helperText="Alert when doses fall below this"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer"
            >
              {editingReminder ? 'Save Changes' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
