import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  Calendar,
  ShoppingBag,
  UserCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const AdminDashboard = () => {
  const {
    user,
    logout,
    medicines,
inventory,
updateInventoryItem,
    appointments,
    updateAppointmentStatus,
    orders,
    updateOrderStatus,
    prescriptions,
    updatePrescriptionStatus,
    doctors,
pharmacies,
addPharmacy,
updatePharmacy,
togglePharmacyStatus,
resetDemoData,
  } = useApp();
  const [pharmacyForm, setPharmacyForm] = useState({
    name: '',
    address: '',
    city: '',
    operatingHours: '',
    deliveryAreas: '',
    phone: '',
    deliveryTime: '',
});

const [editingPharmacyId, setEditingPharmacyId] = useState(null);
const handlePharmacySubmit = (e) => {
    e.preventDefault();

    const pharmacyData = {
        ...pharmacyForm,
        deliveryAreas: pharmacyForm.deliveryAreas
            .split(',')
            .map((area) => area.trim())
            .filter(Boolean),
    };

    if (editingPharmacyId) {
        updatePharmacy(editingPharmacyId, pharmacyData);
    } else {
        addPharmacy(pharmacyData);
    }

    setPharmacyForm({
        name: '',
        address: '',
        city: '',
        operatingHours: '',
        deliveryAreas: '',
        phone: '',
        deliveryTime: '',
    });

    setEditingPharmacyId(null);
};

const handleEditPharmacy = (pharmacy) => {
    setPharmacyForm({
        name: pharmacy.name || '',
        address: pharmacy.address || '',
        city: pharmacy.city || '',
        operatingHours: pharmacy.operatingHours || '',
        deliveryAreas: Array.isArray(pharmacy.deliveryAreas)
            ? pharmacy.deliveryAreas.join(', ')
            : pharmacy.deliveryAreas || '',
        phone: pharmacy.phone || '',
        deliveryTime: pharmacy.deliveryTime || '',
    });

    setEditingPharmacyId(pharmacy.id);
};

  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      }
    } catch (err) {
      console.error('Admin logout error:', err);
    } finally {
      navigate('/admin-login', { replace: true });
    }
  };

  const [activeTab, setActiveTab] = useState('prescriptions'); // 'prescriptions' | 'appointments' | 'orders' | 'doctors'
  const [searchFilter, setSearchFilter] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Stats calculation
  const pendingRxCount = prescriptions.filter((p) => p.demoStatus === 'Pending Review').length;
  const upcomingAptCount = appointments.filter((a) => a.status === 'Upcoming').length;
  const activeOrdersCount = orders.filter(
    (o) => o.demoStatus !== 'Delivered in Demo' && o.demoStatus !== 'Cancelled'
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Teacher & Evaluator Simulation Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Admin Demonstration Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Control and simulate state transitions across prescriptions, appointments, and live delivery pipelines for demonstration to teachers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Demo Data</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Rx</span>
            <FileCheck className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{pendingRxCount}</span>
          <span className="text-[10px] text-purple-700 font-semibold block mt-1">Needs simulation</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Appointments</span>
            <Calendar className="w-4 h-4 text-teal-700" />
          </div>
          <span className="text-2xl font-black text-slate-900">{appointments.length}</span>
          <span className="text-[10px] text-teal-700 font-semibold block mt-1">{upcomingAptCount} upcoming</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Demo Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{orders.length}</span>
          <span className="text-[10px] text-blue-700 font-semibold block mt-1">{activeOrdersCount} in transit</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Doctors</span>
            <UserCheck className="w-4 h-4 text-teal-700" />
          </div>
          <span className="text-2xl font-black text-slate-900">{doctors.length}</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">8 Specialties</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pharmacies</span>
            <Building2 className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-black text-slate-900">{pharmacies.length}</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">NCR Coverage</span>
        </div>
      </div>

      {/* Main Console Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { id: 'prescriptions', label: 'Prescription Queue', count: prescriptions.length },
          { id: 'appointments', label: 'Manage Appointments', count: appointments.length },
          { id: 'orders', label: 'Manage Orders', count: orders.length },
          { id: 'doctors', label: 'Doctor Directory', count: doctors.length },
{ id: 'inventory', label: 'Pharmacy Inventory', count: inventory.length },
{ id: 'pharmacies', label: 'Manage Pharmacies', count: pharmacies.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchFilter('');
            }}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search toolbar inside admin */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter admin records..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* TAB 1: Prescription Verification Simulation */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Simulate pharmacist approvals to test prescription-required checkouts
            </span>
          </div>

          <div className="space-y-3">
            {prescriptions
              .filter(
                (rx) =>
                  !searchFilter ||
                  rx.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  rx.fileName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  rx.id.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-slate-900">
                        Rx #{rx.id}
                      </span>
                      <StatusBadge status={rx.demoStatus} />
                      <span className="text-[11px] text-slate-400">
                        • {rx.submittedAt}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Patient: {rx.patientName} • File: <span className="font-mono text-slate-600">{rx.fileName}</span>
                    </p>
                    {rx.notes && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Patient note: "{rx.notes}"
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      System note: {rx.reviewNote}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        updatePrescriptionStatus(
                          rx.id,
                          'Approved in Demo',
                          'Admin simulation: Approved by demonstration pharmacist.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Approve in Demo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updatePrescriptionStatus(
                          rx.id,
                          'Rejected in Demo',
                          'Admin simulation: Rejected due to missing doctor signature.'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject in Demo
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: Appointments Management */}
      {activeTab === 'appointments' && (
        <div className="space-y-3">
          {appointments
            .filter(
              (apt) =>
                !searchFilter ||
                apt.doctorName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                apt.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                apt.id.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-slate-900">
                      Apt #{apt.id}
                    </span>
                    <StatusBadge status={apt.status} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {apt.doctorName} ({apt.specialty})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient: {apt.patientName} • Date: {formatDate(apt.appointmentDate)} at {apt.appointmentTime}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-600">Change Status:</span>
                  <select
                    value={apt.status}
                    onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders
            .filter(
              (order) =>
                !searchFilter ||
                order.pharmacyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                order.id.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-slate-900">
                      Order #{order.id}
                    </span>
                    <StatusBadge status={order.demoStatus} />
                    <span className="text-xs font-bold text-slate-900">
                      Total: {formatCurrency(order.total)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {order.pharmacyName} • Items: {order.items.length}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Delivery to: {order.deliveryAddress?.recipientName} ({order.deliveryAddress?.city})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-600">Delivery Stage:</span>
                  <select
                    value={order.demoStatus}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Demo Order Placed">1. Demo Order Placed</option>
                    <option value="Pharmacy Reviewing">2. Pharmacy Reviewing</option>
                    <option value="Preparing Order">3. Preparing Order</option>
                    <option value="Out for Delivery">4. Out for Delivery</option>
                    <option value="Delivered in Demo">5. Delivered in Demo</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 4: Doctor Directory List */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-[11px] text-teal-700 font-semibold">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-500">Fee: {formatCurrency(doc.consultationFee)}</p>
                </div>
              </div>
              <Link
                to={`/doctors/${doc.id}`}
                className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-lg"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
      {/* TAB 5: Pharmacy Inventory */}
{activeTab === 'inventory' && (
  <div className="bg-white rounded-2xl border border-slate-200 p-5">
    <h3 className="text-lg font-bold text-slate-900 mb-2">
      Pharmacy Inventory Management
    </h3>
    <p className="text-sm text-slate-500 mb-4">
      Manage medicine prices and stock for each pharmacy.
    </p>

    {pharmacies.map((pharmacy) => {
      const pharmacyItems = inventory.filter(
        (item) => item.pharmacyId === pharmacy.id
      );

      return (
        <div key={pharmacy.id} className="mb-6">
          <h4 className="font-bold text-teal-700 mb-3">
            {pharmacy.name}
          </h4>

          <div className="space-y-3">
            {pharmacyItems.map((item) => {
              const medicine = medicines.find(
                (med) => med.id === item.medicineId
              );

              if (!medicine) return null;

              return (
                <div
                  key={`${item.pharmacyId}-${item.medicineId}`}
                  className="border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900">
                      {medicine.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {medicine.packaging}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <label className="text-xs text-slate-600">
                      Price (₹)
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) =>
                          updateInventoryItem(
                            item.medicineId,
                            item.pharmacyId,
                            { price: Math.max(0, Number(e.target.value) || 0) }
                          )
                        }
                        className="block w-20 mt-1 border rounded-lg p-2"
                      />
                    </label>

                    <label className="text-xs text-slate-600">
                      Stock
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(e) =>
                          updateInventoryItem(
                            item.medicineId,
                            item.pharmacyId,
                            { stock: Math.max(0, Number(e.target.value) || 0) }
                          )
                        }
                        className="block w-20 mt-1 border rounded-lg p-2"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
)}
{activeTab === 'pharmacies' && (
    <div className="space-y-6">

        {/* Add / Edit Pharmacy Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
                {editingPharmacyId ? 'Edit Pharmacy' : 'Add New Pharmacy'}
            </h3>

            <form onSubmit={handlePharmacySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {[
                    ['name', 'Pharmacy Name'],
                    ['address', 'Address'],
                    ['city', 'City'],
                    ['operatingHours', 'Operating Hours'],
                    ['deliveryAreas', 'Delivery Areas (comma separated)'],
                    ['phone', 'Phone Number'],
                    ['deliveryTime', 'Delivery Time'],
                ].map(([field, label]) => (
                    <label key={field} className="text-sm font-semibold text-slate-700">
                        {label}
                        <input
                            required
                            type="text"
                            value={pharmacyForm[field]}
                            onChange={(e) =>
                                setPharmacyForm((current) => ({
                                    ...current,
                                    [field]: e.target.value,
                                }))
                            }
                            className="block w-full mt-1 border border-slate-300 rounded-lg p-2.5"
                        />
                    </label>
                ))}

                <div className="md:col-span-2 flex gap-3">
                    <button
                        type="submit"
                        className="bg-teal-700 text-white px-5 py-2.5 rounded-lg font-bold"
                    >
                        {editingPharmacyId ? 'Save Changes' : 'Add Pharmacy'}
                    </button>

                    {editingPharmacyId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingPharmacyId(null);
                                setPharmacyForm({
                                    name: '',
                                    address: '',
                                    city: '',
                                    operatingHours: '',
                                    deliveryAreas: '',
                                    phone: '',
                                    deliveryTime: '',
                                });
                            }}
                            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg font-bold"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>

        {/* Pharmacy List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
                Registered Pharmacies ({pharmacies.length})
            </h3>

            <div className="space-y-3">
                {pharmacies.map((pharmacy) => (
                    <div
                        key={pharmacy.id}
                        className="border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                        <div>
                            <h4 className="font-bold text-slate-900">
                                {pharmacy.name}
                            </h4>
                            <p className="text-sm text-slate-500">
                                {pharmacy.city} · {pharmacy.address}
                            </p>
                            <span className={`text-xs font-bold ${
                                pharmacy.isActive === false
                                    ? 'text-red-600'
                                    : 'text-green-600'
                            }`}>
                                {pharmacy.isActive === false ? 'Inactive' : 'Active'}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditPharmacy(pharmacy)}
                                className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-bold"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => togglePharmacyStatus(pharmacy.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-bold ${
                                    pharmacy.isActive === false
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                }`}
                            >
                                {pharmacy.isActive === false ? 'Activate' : 'Deactivate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)}

      {/* Admin Session & Bottom Logout Button (Section 5 Requirement) */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Administrator Session Active</h3>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                  Elevated Role
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <span className="text-slate-200 font-medium">{user?.email || 'admin@safemeds.demo'}</span>. Sign out to clear authentication state and secure the console.
              </p>
            </div>
          </div>

          <button
            id="btn-admin-simulation-logout"
            type="button"
            onClick={handleAdminLogout}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>End Admin Session & Logout</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Demonstration Records"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            This will reset all modified appointments, cart items, simulated orders, and prescriptions back to their pristine mock factory state. Ideal before demonstrating to teachers!
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                setShowResetModal(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
