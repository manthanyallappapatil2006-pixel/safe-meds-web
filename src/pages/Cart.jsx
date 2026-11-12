import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Tag,
  ShieldAlert,
  AlertTriangle,
  ShoppingBag
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    discountCode,
    discountAmount,
    applyDiscount,
    hasPrescriptionItems
  } = useApp();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyDiscount(promoInput);
  };

  const handleConfirmClear = () => {
    clearCart();
    setShowClearModal(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 pb-16">
        <EmptyState
          icon={ShoppingCart}
          title="Your Cart is Empty"
          description="You haven't added any medicines or healthcare supplies yet. Explore our pharmacy catalog to add items."
          actionText="Explore Medicines"
          onAction={() => navigate('/medicines')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
          </h1>
          <p className="text-xs text-slate-500">
            Review your healthcare supplies and proceed to simulated checkout
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClearModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Prescription Warning if applicable */}
      {hasPrescriptionItems && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <FileCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Prescription Required For Some Items</p>
              <p className="text-[11px] text-purple-800">
                Your cart contains medications requiring verified doctor authorization. In this demo, an approved prescription in your account or uploaded at checkout is required.
              </p>
            </div>
          </div>
          <Link
            to="/prescriptions"
            className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors shrink-0 text-center"
          >
            Upload Rx Now
          </Link>
        </div>
      )}

      {/* Cart Items List & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300';
                }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.name}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mb-1">
                  {item.packaging}
                </p>
                {item.pharmacyName && (
  <p className="text-[11px] text-blue-700 font-semibold mb-1">
    Pharmacy: {item.pharmacyName}
  </p>
)}
                {item.requiresPrescription && (
                  <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded mb-1">
                    Rx Required
                  </span>
                )}
                <div className="text-xs font-bold text-slate-700">
                  Unit: {formatCurrency(item.price ?? item.indicativePrice)}
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm font-black text-slate-900">
                  {formatCurrency((item.price ?? item.indicativePrice) * item.quantity)}
                </div>

                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(
  item.id,
  item.pharmacyId,
  item.quantity - 1
)}
                    className="p-1 rounded hover:bg-white text-slate-600 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(
  item.id,
  item.pharmacyId,
  item.quantity + 1
)}
                    className="p-1 rounded hover:bg-white text-slate-600 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.pharmacyId)}
                  className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/medicines"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Bill Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Payment Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600">
                Promo Code (Demo)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Try SAFEMEDS10"
                  className="flex-1 px-3 py-1.5 text-xs uppercase rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {discountCode && (
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Coupon {discountCode} applied!</span>
                </p>
              )}
            </form>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Sample Delivery Fee:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE (Above ₹500)</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Demo Discount:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-teal-800">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 text-center">
            *Safe Meds Prototype: Simulated order calculations for academic presentation
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Shopping Cart"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to remove all items from your shopping cart?
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowClearModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Keep Items
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Yes, Clear Cart
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
