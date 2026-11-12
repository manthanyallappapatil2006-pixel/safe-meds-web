import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  Building2,
  MapPin,
  Clock,
  Phone,
  User,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  HelpCircle,
  RotateCw
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const { orders, updateOrderStatus, cancelOrder } = useApp();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === orderId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of delivery plans');

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Order Not Found</h2>
        <p className="text-xs text-slate-500 mb-5">
          Order "{orderId}" was not found in your demo records.
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { title: 'Demo Order Placed', desc: 'Order received and logged in system' },
    { title: 'Pharmacy Reviewing', desc: 'Pharmacist checking item inventory & prescription' },
    { title: 'Preparing Order', desc: 'Medicines securely packaged at dispensing pharmacy' },
    { title: 'Out for Delivery', desc: 'Courier partner en route with sanitized medicine package' },
    { title: 'Delivered in Demo', desc: 'Order delivered safely to destination address' }
  ];

  const getCurrentStepIndex = () => {
    switch (order.demoStatus) {
      case 'Demo Order Placed':
        return 0;
      case 'Pharmacy Reviewing':
        return 1;
      case 'Preparing Order':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered in Demo':
        return 4;
      default:
        return -1; // Cancelled
    }
  };

  const currentIndex = getCurrentStepIndex();

  const handleAdvanceStatus = () => {
    if (currentIndex >= 0 && currentIndex < timelineSteps.length - 1) {
      const nextStatus = timelineSteps[currentIndex + 1].title;
      updateOrderStatus(order.id, nextStatus);
    } else if (currentIndex === timelineSteps.length - 1) {
      // Loop back to start for demonstration replay
      updateOrderStatus(order.id, timelineSteps[0].title);
    }
  };

  const handleConfirmCancel = () => {
    cancelOrder(order.id, cancelReason);
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Student / Teacher Live Demonstration Control */}
        {order.demoStatus !== 'Cancelled' && (
          <button
            type="button"
            onClick={handleAdvanceStatus}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Advance status to next milestone for teacher evaluation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Advance Demo Status ({currentIndex + 1}/5)</span>
          </button>
        )}
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Order #{order.id}
              </h1>
              <StatusBadge status={order.demoStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {order.createdAt} from {order.pharmacyName}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Total Demo Amount
            </span>
            <span className="text-xl font-black text-slate-900">
              {formatCurrency(order.total)}
            </span>
            <span className="text-[11px] text-slate-500 block">({order.paymentMethod})</span>
          </div>
        </div>

        {/* Status Timeline */}
        {order.demoStatus === 'Cancelled' ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs mb-6 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Order Cancelled in Demo</p>
              <p className="mt-0.5">
                This demonstration order was cancelled. Reason: "{order.cancelReason || 'Cancelled by user'}"
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Simulated Delivery Timeline
            </h2>
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineSteps.map((step, idx) => {
                const isCompleted = currentIndex >= idx;
                const isCurrent = currentIndex === idx;

                return (
                  <div key={step.title} className="relative">
                    <span
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-teal-700 text-white ring-4 ring-teal-100 shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>

                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent
                            ? 'text-teal-900'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            Current Stage
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Illustrative Route Map Placeholder */}
        <div className="bg-teal-950/90 text-teal-200 rounded-2xl p-5 mb-6 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[150px] border border-teal-800">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
          <Navigation className="w-8 h-8 text-teal-400 mb-2 animate-bounce" />
          <p className="text-xs font-bold text-white">Illustrative Delivery Map Placeholder</p>
          <p className="text-[11px] text-teal-300 max-w-sm">
            Simulated route from {order.pharmacyName} to {order.deliveryAddress?.city}
          </p>
          <span className="text-[10px] text-teal-400/80 mt-1">
            *Demo simulation only • Not actual GPS broadcast
          </span>
        </div>

        {/* Delivery Partner Details & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Assigned Demo Delivery Partner
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {order.deliveryPartner?.name || 'Ramesh Kumar (Demo Partner)'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {order.deliveryPartner?.vehicle || 'Two Wheeler'}
                </p>
                <a
                  href={`tel:${order.deliveryPartner?.phone}`}
                  className="text-[11px] text-teal-700 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{order.deliveryPartner?.phone || '+91 98990 01122'}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Delivery Destination
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">
                  {order.deliveryAddress?.recipientName} ({order.deliveryAddress?.phone})
                </p>
                <p className="text-slate-600 mt-0.5">
                  {order.deliveryAddress?.house}, {order.deliveryAddress?.street}
                </p>
                <p className="text-slate-500">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pinCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Items in this order ({order.items.length})
          </h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <span className="text-[11px] text-slate-500">
                     Qty: {item.quantity} • {formatCurrency(item.price ?? item.indicativePrice)} each
                    </span>
                  </div>
                </div>
                <span className="font-black text-slate-900">
                 {formatCurrency((item.price ?? item.indicativePrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
          <Link
            to="/help"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need Help with Order?</span>
          </Link>

          {true && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              Cancel Demo Order
            </button>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Demonstration Order"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to cancel demonstration order #{order.id}?
          </p>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Reason for Cancellation
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800"
            >
              <option value="Change of delivery plans">Change of delivery plans</option>
              <option value="Ordered by mistake in demo">Ordered by mistake in demo</option>
              <option value="Doctor prescribed alternate brand">Doctor prescribed alternate brand</option>
              <option value="Testing demo cancellation flow">Testing demo cancellation flow</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Keep Order
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
