import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  Calendar,
  ShoppingBag,
  Bell,
  Settings,
  LogOut,
  RotateCcw,
  Edit,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { validateAddressForm, validateContactForm } from '../utils/validation';
import { useApp } from '../context/AppContext';

export const Profile = () => {
  const {
    user,
    logout,
    language,
    setLanguage,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    appointments,
    orders,
    resetDemoData,
  } = useApp();

  const navigate = useNavigate();

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipientName: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pinCode: '201305',
    isDefault: false
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Contact Modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: 'Family',
    phone: '',
    isPrimary: false
  });
  const [contactErrors, setContactErrors] = useState({});

  // Delete Confirm Modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'address' | 'contact', id, name }

  // Preferences Toggles
  const [prefs, setPrefs] = useState({
    smsAlerts: true,
    emailReminders: true,
    emergencyBroadcasts: true
  });

  const handleOpenNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      label: 'Home',
      recipientName: user?.name || '',
      phone: user?.phone || '',
      house: '',
      street: '',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201305',
      isDefault: false
    });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm(addr);
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const validation = validateAddressForm(addressForm);
    if (!validation.isValid) {
      setAddressErrors(validation.errors);
      return;
    }

    if (editingAddress) {
      updateAddress({ ...addressForm, id: editingAddress.id });
    } else {
      addAddress(addressForm);
    }
    setShowAddressModal(false);
  };

  const handleOpenNewContact = () => {
    setEditingContact(null);
    setContactForm({
      name: '',
      relationship: 'Parent',
      phone: '',
      isPrimary: emergencyContacts.length === 0
    });
    setContactErrors({});
    setShowContactModal(true);
  };

  const handleOpenEditContact = (c) => {
    setEditingContact(c);
    setContactForm(c);
    setContactErrors({});
    setShowContactModal(true);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    const validation = validateContactForm(contactForm);
    if (!validation.isValid) {
      setContactErrors(validation.errors);
      return;
    }

    if (editingContact) {
      updateEmergencyContact({ ...contactForm, id: editingContact.id });
    } else {
      addEmergencyContact(contactForm);
    }
    setShowContactModal(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'address') {
      deleteAddress(deleteTarget.id);
    } else if (deleteTarget.type === 'contact') {
      deleteEmergencyContact(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name || 'Profile'}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-100 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250';
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {user?.isGuest ? 'Guest Demo Mode' : 'Registered Patient'}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                ID: {user?.id || 'SM-USR'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {user?.name || 'Demo Patient'}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email || 'patient@safemeds.demo'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {user?.phone || '9876543210'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user?.city || 'Noida, India'}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              to="/profile/edit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 text-center">
          <Link to="/appointments" className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 transition-colors">
            <span className="text-lg sm:text-xl font-black text-slate-900 block">
              {appointments.length}
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              Appointments
            </span>
          </Link>
          <Link to="/orders" className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 transition-colors">
            <span className="text-lg sm:text-xl font-black text-slate-900 block">
              {orders.length}
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              Medicine Orders
            </span>
          </Link>
          <div className="p-3 rounded-2xl bg-slate-50">
            <span className="text-lg sm:text-xl font-black text-slate-900 block">
              {emergencyContacts.length}
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              SOS Contacts
            </span>
          </div>
        </div>
      </div>

      {/* Saved Addresses Section (Section 25) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Saved Delivery Addresses ({addresses.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={handleOpenNewAddress}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.2 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {addr.recipientName} ({addr.phone})
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {addr.house}, {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleOpenEditAddress(addr)}
                  className="text-xs font-bold text-slate-600 hover:text-teal-700 cursor-pointer"
                >
                  Edit
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({ type: 'address', id: addr.id, name: addr.label })
                  }
                  className="text-xs font-bold text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Section (Section 26) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Emergency Contacts ({emergencyContacts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={handleOpenNewContact}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {emergencyContacts.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-xs font-bold text-slate-900">{c.name}</h3>
                  {c.isPrimary && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.2 rounded-full">
                      Primary SOS
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {c.relationship} • {c.phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditContact(c)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Edit contact"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({ type: 'contact', id: c.id, name: c.name })
                  }
                  className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences & Privacy Settings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-700" />
          <span>Notification & Privacy Preferences</span>
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">SMS Appointment Reminders</p>
              <p className="text-[11px] text-slate-500">Receive simulated appointment confirmation alerts</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.smsAlerts}
              onChange={(e) => setPrefs((prev) => ({ ...prev, smsAlerts: e.target.checked }))}
              className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">Email Prescription & Order Updates</p>
              <p className="text-[11px] text-slate-500">Get status changes for prescription approvals</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.emailReminders}
              onChange={(e) => setPrefs((prev) => ({ ...prev, emailReminders: e.target.checked }))}
              className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
          </label>
        </div>

        {/* Language Preference (Section 6 & 14 Requirement) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Languages className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">Language Preference / भाषा प्राधान्य</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Choose your preferred language for website navigation and interface labels:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en', label: 'English', sub: 'Default' },
              { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
              { code: 'mr', label: 'मराठी', sub: 'Marathi' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  language === item.code
                    ? 'border-teal-700 bg-teal-50 text-teal-800 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div>{item.label}</div>
                <div className="text-[10px] font-normal text-slate-400">{item.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Demo Data & Logout Actions */}
      <div className="bg-slate-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Prototype Presentation Controls
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset all appointments, orders, and emergency requests back to default demonstration records.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={resetDemoData}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              if (typeof logout === 'function') await logout();
              navigate('/login', { replace: true });
            }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title={editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Address Label (e.g. Home, Work, Hostel)
            </label>
            <select
              value={addressForm.label}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, label: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            >
              <option value="Home">Home</option>
              <option value="Work / College">Work / College</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Recipient Name"
              name="recipientName"
              value={addressForm.recipientName}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, recipientName: e.target.value }))}
              required
              error={addressErrors.recipientName}
            />
            <FormField
              label="Mobile Number"
              name="phone"
              value={addressForm.phone}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
              required
              error={addressErrors.phone}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="House / Building"
              name="house"
              value={addressForm.house}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, house: e.target.value }))}
              placeholder="Flat 402, Tower B"
              required
              error={addressErrors.house}
            />
            <FormField
              label="Street / Sector"
              name="street"
              value={addressForm.street}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="Sector 143B"
              required
              error={addressErrors.street}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField
              label="City"
              name="city"
              value={addressForm.city}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
              required
              error={addressErrors.city}
            />
            <FormField
              label="State"
              name="state"
              value={addressForm.state}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
              required
              error={addressErrors.state}
            />
            <FormField
              label="PIN Code"
              name="pinCode"
              value={addressForm.pinCode}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, pinCode: e.target.value }))}
              required
              error={addressErrors.pinCode}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
              className="rounded border-slate-300 text-teal-700"
            />
            <span className="text-xs text-slate-700 font-medium">Set as default delivery address</span>
          </label>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title={editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
      >
        <form onSubmit={handleSaveContact} className="space-y-3.5">
          <FormField
            label="Contact Full Name"
            name="name"
            value={contactForm.name}
            onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Rajesh Sharma"
            required
            error={contactErrors.name}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Relationship"
              name="relationship"
              value={contactForm.relationship}
              onChange={(e) => setContactForm((prev) => ({ ...prev, relationship: e.target.value }))}
              placeholder="e.g. Parent, Sibling, Friend"
            />
            <FormField
              label="Mobile Number"
              name="phone"
              value={contactForm.phone}
              onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. 9811223344"
              required
              error={contactErrors.phone}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={contactForm.isPrimary}
              onChange={(e) => setContactForm((prev) => ({ ...prev, isPrimary: e.target.checked }))}
              className="rounded border-slate-300 text-teal-700"
            />
            <span className="text-xs text-slate-700 font-medium">Set as primary emergency contact</span>
          </label>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer"
            >
              Save Contact
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to remove <strong>"{deleteTarget?.name}"</strong> from your saved{' '}
            {deleteTarget?.type === 'address' ? 'addresses' : 'emergency contacts'}?
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
