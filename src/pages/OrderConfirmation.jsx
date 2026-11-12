import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin, Truck, ArrowRight, Home } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const OrderConfirmation = () => {
  const location = useLocation();
  const { orders } = useApp();

  const order = location.state?.order || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-2">No Order Details</h2>
        <p className="text-xs text-slate-500 mb-5">
          Please place an order to see the confirmation screen.
        </p>
        <Link
          to="/medicines"
          className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 pb-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
          Demo Order Placed
        </span>

        <h1 className="text-2xl font-black text-slate-900 mb-1">
          Thank You for Your Order!
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Your simulated healthcare order has been recorded and routed to the pharmacy.
        </p>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3.5 mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Order Reference
              </span>
              <span className="text-sm font-black text-slate-900">
                #{order.id}
              </span>
            </div>
            <StatusBadge status={order.demoStatus} />
          </div>

          <div className="pt-3 border-t border-slate-200">
  <h3 className="text-xs font-bold text-slate-900 mb-2">
    Ordered Medicines
  </h3>

  <div className="space-y-2">
    {(order.items || []).map((item, index) => (
      <div
        key={`${item.id}-${item.pharmacyId || ''}-${index}`}
        className="flex justify-between gap-3 text-xs"
      >
        <div>
          <p className="font-semibold text-slate-800">
            {item.name}
          </p>
          <p className="text-slate-500">
            Quantity: {item.quantity}
          </p>
        </div>

        <p className="font-bold text-slate-900">
          {formatCurrency(
            (item.price ?? item.indicativePrice) * item.quantity
          )}
        </p>
      </div>
    ))}
  </div>
</div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Pharmacy:</span>
              <span className="font-bold text-slate-900">{order.pharmacyName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Est. Arrival:</span>
              <span className="font-bold text-emerald-700">{order.estimatedDelivery}</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block mb-1">Delivering to:</span>
              <p className="font-medium text-slate-800">
                {order.deliveryAddress?.recipientName} • {order.deliveryAddress?.house}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
              </p>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Total Paid (Demo):</span>
              <span className="font-black text-slate-900 text-sm">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={`/orders/${order.id}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Demo Status</span>
          </Link>

          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
