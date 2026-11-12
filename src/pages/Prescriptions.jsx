import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Camera,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  AlertCircle,
  ShieldCheck,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { FormField } from '../components/FormField';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { validatePrescriptionFile } from '../utils/validation';
import { useApp } from '../context/AppContext';

export const Prescriptions = () => {
  const { user, prescriptions, submitPrescription, updatePrescriptionStatus } = useApp();
 


  // Show only prescriptions belonging to the logged-in patient.
const belongsToCurrentPatient = (rx) =>
  (user?.id && rx.patientId === user.id) ||
  (user?.email &&
    rx.patientEmail?.toLowerCase() === user.email.toLowerCase());

const doctorIssuedPrescriptions = prescriptions.filter(
  (rx) =>
    rx.type === 'doctor-issued' &&
    belongsToCurrentPatient(rx)
);


const uploadedPrescriptions = prescriptions.filter(
  (rx) =>
    rx.type !== 'doctor-issued' &&
    belongsToCurrentPatient(rx)
);

  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    relatedOrderId: '',
    notes: '',
    consent: false
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTriggerCamera = () => {
    cameraInputRef.current?.click();
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Upload simulation progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePrescriptionFile(file);
    if (!validation.isValid) {
      setFileError(validation.error);
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setFileError('');
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!selectedFile) {
      errors.file = 'Please upload a prescription image or PDF file';
    }
    if (!formData.patientName.trim()) {
      errors.patientName = 'Patient full name is required';
    }
    if (!formData.consent) {
      errors.consent = 'You must give consent for demonstration review';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);
      setUploadSuccess(true);

      submitPrescription({
        fileName: selectedFile.name,
        fileUrl: filePreview,
        patientName: formData.patientName,
        relatedOrderId: formData.relatedOrderId || null,
        notes: formData.notes
      });

      // Reset form
      setSelectedFile(null);
      setFilePreview(null);
      setFormData({
        patientName: user?.name || '',
        relatedOrderId: '',
        notes: '',
        consent: false
      });

      setTimeout(() => setUploadSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Prescription Verification
          </h1>
          <p className="text-xs text-slate-500">
            Upload doctor prescriptions for simulated pharmacist review & order approvals
          </p>
        </div>

        <Link
          to="/admin-demo"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-700" />
          <span>Simulate Rx Review in Admin</span>
        </Link>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Academic Simulation Notice</span>
        </div>
        <p className="leading-relaxed">
          Safe Meds is a college field prototype. Prescriptions uploaded here are processed through a simulated evaluation queue. Files are kept temporarily in memory for preview and are <strong>not stored on external servers</strong>. No real pharmacist provides clinical diagnosis.
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Prescription Submitted Successfully!</p>
            <p className="text-emerald-700">
              Your prescription has been queued as "Pending Review". You can simulate immediate approval using the quick buttons below or via Admin Demo.
            </p>
          </div>
        </div>
      )}

      {/* Prescription Upload Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-700" />
          <span>Upload Doctor's Prescription (Demo)</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker & Camera Capture Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Select Prescription File (JPG, PNG, WEBP, PDF up to 5MB) <span className="text-red-500">*</span>
            </label>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div className="space-y-3">
                {/* Dual Buttons: File Upload + Camera Capture Beside It (Section 11 Requirement) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerUpload}
                    className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border-2 border-teal-600 bg-teal-50 hover:bg-teal-100/80 text-teal-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <UploadCloud className="w-5 h-5 text-teal-700" />
                    <span>Upload File (PDF/Image)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerCamera}
                    className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-teal-700" />
                    <span>Camera Capture</span>
                  </button>
                </div>

                <div
                  onClick={handleTriggerUpload}
                  className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition-all"
                >
                  <p className="text-xs font-bold text-slate-700">Or drag and drop files here</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 5 MB</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Prescription preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200">
                        PDF
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Document'}
                      </p>
                      <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded-md">
                        Ready for review
                      </span>
                    </div>
                  </div>

                  {/* Actions: Replace or Remove */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      title="Replace file"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {filePreview && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-[11px] text-slate-500 mb-2 font-medium">Prescription Photo Preview:</p>
                    <div className="max-h-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                      <img
                        src={filePreview}
                        alt="Full prescription preview"
                        className="max-h-52 w-auto mx-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {(fileError || formErrors.file) && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fileError || formErrors.file}</span>
              </p>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Patient Full Name"
              name="patientName"
              value={formData.patientName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, patientName: e.target.value }))
              }
              placeholder="Full name as written on prescription"
              required
              error={formErrors.patientName}
            />

            <FormField
              label="Related Order ID (Optional)"
              name="relatedOrderId"
              value={formData.relatedOrderId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, relatedOrderId: e.target.value }))
              }
              placeholder="e.g. ORD-5001 (or leave empty)"
            />
          </div>

          <FormField
            label="Notes for Pharmacist Reviewer (Optional)"
            name="notes"
            type="textarea"
            rows={2}
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="e.g. Doctor prescribed 15 days dosage. Please verify tablet brand."
          />

          {/* Consent Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, consent: e.target.checked }))
                }
                className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span className="text-xs text-slate-600 leading-tight">
                I hereby submit this document for demonstration verification and confirm it is a valid medical record intended for prototype evaluation.
              </span>
            </label>
            {formErrors.consent && (
              <p className="text-xs text-red-600 font-medium mt-1">
                {formErrors.consent}
              </p>
            )}
          </div>

          {/* Simulated Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>Simulating secure prescription upload...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-teal-700 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? 'Uploading Prescription...' : 'Submit Prescription for Demo Review'}</span>
          </button>
        </form>
      </div>

      {/* Prescriptions Issued by Doctor */}
<div className="space-y-4">
  <div>
    <h2 className="text-base font-bold text-slate-900">
      Prescriptions from Your Doctor
    </h2>
    <p className="text-xs text-slate-500 mt-1">
      View prescriptions issued during your appointments.
    </p>
  </div>

  {doctorIssuedPrescriptions.length === 0 ? (
    <EmptyState
      icon={FileText}
      title="No doctor prescriptions yet"
      description="Prescriptions issued by your doctor will appear here."
    />
  ) : (
    <div className="space-y-3">
      {doctorIssuedPrescriptions.map((rx) => (
        <div
          key={rx.id}
          className="bg-white rounded-2xl border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900">
              {rx.doctorName || 'Your Doctor'}
            </h3>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Doctor Issued
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Patient: {rx.patientName}
          </p>

          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-700 mb-2">
              Prescription Details
            </p>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">
              {rx.prescriptionDetails}
            </p>
          </div>

          {rx.notes && (
            <p className="text-xs text-slate-600 mt-3">
              <strong>Doctor's Notes:</strong> {rx.notes}
            </p>
          )}

          <p className="text-xs text-slate-400 mt-3">
            Issued: {rx.date || 'Date unavailable'}
          </p>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Uploaded Prescriptions List with Status Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Uploaded Prescriptions ({uploadedPrescriptions.length})
          </h2>
          <span className="text-xs text-slate-400">Status Verification Queue</span>
        </div>

        {uploadedPrescriptions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No prescriptions uploaded"
            description="Upload your doctor's prescription above to start demonstration verification."
          />
        ) : (
          <div className="space-y-3">
            {uploadedPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      Rx #{rx.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      • {rx.fileName}
                    </span>
                  </div>
                  <StatusBadge status={rx.demoStatus} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Patient Name
                    </span>
                    <span className="text-slate-800 font-semibold">{rx.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Submitted On
                    </span>
                    <span className="text-slate-800 font-medium">{rx.submittedAt}</span>
                  </div>
                </div>

                {rx.notes && (
                  <p className="text-xs text-slate-600 mb-2">
                    <strong>Patient Note:</strong> {rx.notes}
                  </p>
                )}

                <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-700 mb-3">
                  <span className="font-bold text-slate-900">Reviewer Note: </span>
                  {rx.reviewNote}
                </div>

                {/* Quick Simulation controls for teacher demonstration */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">
                    Simulate Decision:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updatePrescriptionStatus(
                          rx.id,
                          'Approved in Demo',
                          'Simulated approval: Verified doctor registration and dosage in demo.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Approve in Demo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updatePrescriptionStatus(
                          rx.id,
                          'Rejected in Demo',
                          'Simulated rejection: Stamp not clear in demonstration file.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors cursor-pointer"
                    >
                      Reject in Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
