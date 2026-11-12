import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Banknote,
  FileCheck,
  Building2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Truck,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { FormField } from '../components/FormField';
import { StatusBadge } from '../components/StatusBadge';
import { validateAddressForm } from '../utils/validation';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const Checkout = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    discountAmount,
    discountCode,
    addresses,
    prescriptions,
    pharmacies,
    placeOrder,
    hasPrescriptionItems,
    user
  } = useApp();

  const navigate = useNavigate();

  // Pre-fill with default address if available
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const [addressMode, setAddressMode] = useState(defaultAddr ? 'saved' : 'new');
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?.id || '');

  const [newAddress, setNewAddress] = useState({
    recipientName: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pinCode: '201305',
    deliveryInstructions: ''
  });

  const cartPharmacyId = cart[0]?.pharmacyId || '';

const [selectedPharmacyId, setSelectedPharmacyId] = useState(
    cartPharmacyId || pharmacies[0]?.id || 'PHARM-201'
);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (Demo)');
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-5">
          Please add medicines to your cart before proceeding to checkout.
        </p>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <span>Browse Medicines</span>
        </Link>
      </div>
    );
  }

  // Check if prescription is required and approved
  const approvedPrescription = prescriptions.find((p) => p.demoStatus === 'Approved in Demo');
  const isPrescriptionBlocked = hasPrescriptionItems && !approvedPrescription;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (isPlacing) return;

    // Ensure all cart items belong to the same pharmacy
const cartPharmacyIds = [
  ...new Set(cart.map((item) => item.pharmacyId).filter(Boolean))
];

if (cartPharmacyIds.length > 1) {
  setErrors({
    pharmacy: 'Your cart contains medicines from different pharmacies. Please place separate orders.'
  });
  return;
}

if (
  cartPharmacyIds.length === 1 &&
  selectedPharmacyId !== cartPharmacyIds[0]
) {
  setSelectedPharmacyId(cartPharmacyIds[0]);
  setErrors({
    pharmacy: 'The pharmacy has been updated to match your cart. Please review your order.'
  });
  return;
}
// Check whether the selected pharmacy is active
const selectedPharmacy = pharmacies.find(
  (pharmacy) => pharmacy.id === selectedPharmacyId
);

if (!selectedPharmacy || selectedPharmacy.isActive === false) {
  setErrors({
    pharmacy: 'This pharmacy is currently unavailable. Please remove these medicines and choose an active pharmacy.'
  });
  return;
}


if (!selectedPharmacy || selectedPharmacy.isActive === false) {
  setErrors({
    pharmacy: 'This pharmacy is currently unavailable. Please remove these medicines and choose an active pharmacy.'
  });
  return;
}
    // Check prescription constraint
    if (isPrescriptionBlocked) {
      setErrors({
        rx: 'This order includes prescription medication. A demo-approved prescription is required before completing checkout.'
      });
      return;
    }

    let deliveryAddress;
    if (addressMode === 'saved') {
      const target = addresses.find((a) => a.id === selectedAddressId);
      if (!target) {
        setErrors({ address: 'Please select a delivery address' });
        return;
      }
      deliveryAddress = target;
    } else {
      const validation = validateAddressForm(newAddress);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      deliveryAddress = newAddress;
    }

    setIsPlacing(true);

   
    setTimeout(() => {
      const order = placeOrder({
        items: [...cart],
        pharmacyId: selectedPharmacyId,
        pharmacyName: selectedPharmacy ? selectedPharmacy.name : 'Apollo Lifeline Chemist',
        deliveryAddress,
        subtotal: cartSubtotal,
        deliveryFee,
        discount: discountAmount,
        total: cartTotal,
        paymentMethod,
        prescriptionStatus: hasPrescriptionItems ? 'Approved in Demo' : 'Not Required'
      });

      setIsPlacing(false);
      navigate('/orders/confirmation', { state: { order } });
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Cart</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prescription Status Check Card */}
          {hasPrescriptionItems && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                approvedPrescription
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-purple-50 border-purple-200 text-purple-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>Prescription Verification Status</span>
                </div>
                {approvedPrescription ? (
                  <StatusBadge status="Approved in Demo" />
                ) : (
                  <StatusBadge status="Pending Review" />
                )}
              </div>

              {approvedPrescription ? (
                <p className="text-[11px] text-emerald-800">
                  Demo prescription <strong>#{approvedPrescription.id}</strong> ({approvedPrescription.fileName}) is verified and linked to this order.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-purple-800">
                    You have prescription medicines in your cart, but no prescription is marked <strong>"Approved in Demo"</strong> yet.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to="/prescriptions"
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
                    >
                      Upload Prescription
                    </Link>
                    <Link
                      to="/admin-demo"
                      className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-900 font-bold text-xs hover:bg-purple-50 flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>One-Click Approve in Admin Demo</span>
                    </Link>
                  </div>
                </div>
              )}

              {errors.pharmacy && (
  <p className="text-xs text-red-600 font-bold mt-1">
    {errors.pharmacy}
  </p>
)}  
            </div>
          )}

          {/* Fulfilling Pharmacy Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>Select Dispensing Pharmacy</span>
            </h2>

            <select
              value={selectedPharmacyId}
              onChange={() => {}}
              disabled
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {pharmacies.map((pharm) => (
                <option key={pharm.id} value={pharm.id}>
                  {pharm.name} — {pharm.city} ({pharm.deliveryTime} delivery)
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Delivery Address</span>
              </h2>

              {addresses.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAddressMode('saved')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      addressMode === 'saved'
                        ? 'bg-teal-100 text-teal-800'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Saved Addresses
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressMode('new')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      addressMode === 'new'
                        ? 'bg-teal-100 text-teal-800'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    + Enter New Address
                  </button>
                </div>
              )}
            </div>

            {addressMode === 'saved' && addresses.length > 0 ? (
              <div className="space-y-2.5">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-100'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="savedAddress"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-teal-700 focus:ring-teal-600"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">{addr.label}</span>
                          <span className="text-slate-500">• {addr.recipientName} ({addr.phone})</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">
                          {addr.house}, {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Recipient Full Name"
                    name="recipientName"
                    value={newAddress.recipientName}
                    onChange={handleAddressChange}
                    placeholder="e.g. Manthan Sharma"
                    required
                    error={errors.recipientName}
                  />

                  <FormField
                    label="Mobile Number"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="e.g. 9876543210"
                    required
                    error={errors.phone}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="House / Flat / Building"
                    name="house"
                    value={newAddress.house}
                    onChange={handleAddressChange}
                    placeholder="e.g. Flat 402, Tower B"
                    required
                    error={errors.house}
                  />

                  <FormField
                    label="Street / Area / Landmark"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressChange}
                    placeholder="e.g. Sector 143B, Expressway"
                    required
                    error={errors.street}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField
                    label="City"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    required
                    error={errors.city}
                  />

                  <FormField
                    label="State"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    required
                    error={errors.state}
                  />

                  <FormField
                    label="Postal PIN Code"
                    name="pinCode"
                    value={newAddress.pinCode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 201305"
                    required
                    error={errors.pinCode}
                  />
                </div>

                <FormField
                  label="Delivery Instructions (Optional)"
                  name="deliveryInstructions"
                  value={newAddress.deliveryInstructions}
                  onChange={handleAddressChange}
                  placeholder="e.g. Leave with security guard if unavailable"
                />
              </div>
            )}
          </div>

          {/* Demo Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-700" />
              <span>Simulated Payment Method</span>
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  id: 'Cash on Delivery (Demo)',
                  label: 'Cash on Delivery (Demo Simulation)',
                  desc: 'Pay cash to demo delivery partner upon arrival. No card needed.',
                  icon: Banknote
                },
                {
                  id: 'Simulated Online Payment',
                  label: 'Simulated Online Payment (UPI / Card Demo)',
                  desc: 'Instant mock transaction approval. No actual banking credentials required.',
                  icon: CreditCard
                }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <label
                    key={m.id}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-100'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="mt-1 text-teal-700 focus:ring-teal-600"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Icon className="w-4 h-4 text-teal-700" />
                          <span className="font-bold text-slate-900">{m.label}</span>
                        </div>
                        <p className="text-slate-500">{m.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 italic">
              *Safe Meds will never ask for real bank account numbers, passwords, or UPI pins.
            </p>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Final Submit */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Order Items ({cart.length})
            </h2>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">
                    {formatCurrency(item.indicativePrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-teal-800">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacing || isPrescriptionBlocked}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isPlacing ? 'Processing Demo Order...' : 'Place Demo Order'}</span>
            </button>

            {isPrescriptionBlocked && (
              <p className="text-[11px] text-red-600 font-medium text-center">
                Approval needed for prescription items before placing order.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
