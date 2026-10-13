import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Eye,
  CheckCircle2,
  UploadCloud,
  Filter,
  FileCheck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { EmptyState } from '../components/EmptyState';
import { validatePrescriptionFile } from '../utils/validation';
import { formatDate } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const HealthRecords = () => {
  const { healthRecords, addHealthRecord, deleteHealthRecord } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Lab Report',
    doctorOrHospital: '',
    recordDate: new Date().toISOString().split('T')[0],
    fileName: '',
    fileUrl: null,
    notes: ''
  });

  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    'All',
    'Lab Report',
    'Prescription',
    'Immunization',
    'Discharge Summary',
    'Doctor Note'
  ];

  const filteredRecords = healthRecords.filter(
    (rec) => activeCategory === 'All' || rec.category === activeCategory
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePrescriptionFile(file);
    if (!validation.isValid) {
      setFileError(validation.error);
      return;
    }

    setFileError('');
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setFormData((prev) => ({
      ...prev,
      fileName: file.name,
      fileUrl: previewUrl
    }));
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      category: 'Lab Report',
      doctorOrHospital: '',
      recordDate: new Date().toISOString().split('T')[0],
      fileName: '',
      fileUrl: null,
      notes: ''
    });
    setFileError('');
    setErrors({});
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Record title is required';
    if (!formData.fileName) errs.file = 'Please upload a medical document file';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    addHealthRecord(formData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Personal Health Records Organizer
            </h1>
            <span className="text-[11px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              Safe Vault
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Securely store lab tests, vaccine certificates, discharge papers, and clinical summaries in one place
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Record</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No records in this category"
          description="Upload your blood reports, hospital summaries, or vaccination records to organize your health file."
          actionText="Upload Record"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-teal-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.2 rounded-md">
                      {record.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {formatDate(record.recordDate)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {record.title}
                  </h3>

                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {record.doctorOrHospital ? `Issuer: ${record.doctorOrHospital}` : ''} • File: <span className="font-mono text-slate-600">{record.fileName}</span>
                  </p>

                  {record.notes && (
                    <p className="text-xs text-slate-600 italic mt-1 line-clamp-1">
                      Note: "{record.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewRecord(record)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteHealthRecord(record.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Record Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Upload Medical Health Record"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Record Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Complete Blood Count (CBC), COVID Booster, Discharge Note"
            required
            error={errors.title}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Immunization">Immunization</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Doctor Note">Doctor Note</option>
              </select>
            </div>

            <FormField
              label="Record Date"
              name="recordDate"
              type="date"
              value={formData.recordDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, recordDate: e.target.value }))}
              required
            />
          </div>

          <FormField
            label="Hospital, Lab or Doctor Name"
            name="doctorOrHospital"
            value={formData.doctorOrHospital}
            onChange={(e) => setFormData((prev) => ({ ...prev, doctorOrHospital: e.target.value }))}
            placeholder="e.g. Dr. Lal PathLabs, Max Super Specialty Hospital"
          />

          {/* File Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Document File (JPG, PNG, PDF up to 5MB) <span className="text-red-500">*</span>
            </label>

            {!formData.fileName ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/20 transition-all">
                <UploadCloud className="w-8 h-8 text-teal-700 mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  Click to select medical report
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Kept safe and private in local demonstration memory
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 truncate">{formData.fileName}</span>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, fileName: '', fileUrl: null }))}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Change File
                </button>
              </div>
            )}

            {(fileError || errors.file) && (
              <p className="text-xs text-red-600 font-medium">{fileError || errors.file}</p>
            )}
          </div>

          <FormField
            label="Clinical Findings / Personal Notes"
            name="notes"
            type="textarea"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="e.g. Normal blood sugar levels. Advised to re-test in 6 months."
          />

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Preview Modal */}
      <Modal
        isOpen={Boolean(previewRecord)}
        onClose={() => setPreviewRecord(null)}
        title="Medical Record Inspection"
      >
        {previewRecord && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
              <span className="text-[10px] font-bold uppercase text-teal-800 block">
                {previewRecord.category}
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">
                {previewRecord.title}
              </h3>
              <p className="text-slate-600 mt-1">
                Issued by: <strong>{previewRecord.doctorOrHospital || 'Self-logged Clinic'}</strong> on {formatDate(previewRecord.recordDate)}
              </p>
            </div>

            {previewRecord.fileUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64 flex items-center justify-center bg-slate-100">
                <img
                  src={previewRecord.fileUrl}
                  alt={previewRecord.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50 text-slate-500">
                <FileCheck className="w-8 h-8 text-teal-700 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800">{previewRecord.fileName}</p>
                <p className="text-[11px] text-slate-400">PDF document attached in demonstration memory</p>
              </div>
            )}

            {previewRecord.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <strong>Doctor's Remarks: </strong>
                <span>{previewRecord.notes}</span>
              </div>
            )}

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
