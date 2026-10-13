import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  Clock,
  ArrowRight,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const Orders = () => {
  const { orders, reorder } = useApp();
  const [activeTab, setActiveTab] = useState('All Orders'); // 'All Orders' | 'Processing' | 'Delivered in Demo' | 'Cancelled'

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Delivered in Demo') return order.demoStatus === 'Delivered in Demo';
    if (activeTab === 'Cancelled') return order.demoStatus === 'Cancelled';
    if (activeTab === 'Processing') {
      return (
        order.demoStatus === 'Demo Order Placed' ||
        order.demoStatus === 'Pharmacy Reviewing' ||
        order.demoStatus === 'Preparing Order' ||
        order.demoStatus === 'Out for Delivery'
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Medicine Orders
          </h1>
          <p className="text-xs text-slate-500">
            Inspect your order history, track deliveries, and reorder sample items
          </p>
        </div>

        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Order New Medicines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {['All Orders', 'Processing', 'Delivered in Demo', 'Cancelled'].map((tab) => {
          let count = 0;
          if (tab === 'All Orders') count = orders.length;
          else if (tab === 'Delivered in Demo')
            count = orders.filter((o) => o.demoStatus === 'Delivered in Demo').length;
          else if (tab === 'Cancelled')
            count = orders.filter((o) => o.demoStatus === 'Cancelled').length;
          else if (tab === 'Processing')
            count = orders.filter((o) => o.demoStatus !== 'Delivered in Demo' && o.demoStatus !== 'Cancelled').length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={`No ${activeTab.toLowerCase()} orders`}
          description="You do not have any orders in this category."
          actionText="Browse Medicines"
          onAction={() => window.location.href = '#/medicines'}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      Order #{order.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      • {order.createdAt}
                    </span>
                  </div>
                  <StatusBadge status={order.demoStatus} />
                </div>

                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                      {order.pharmacyName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                      {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="text-base font-black text-slate-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 flex items-center justify-between">
                  <span>Method: {order.paymentMethod}</span>
                  <span className="text-emerald-700 font-semibold">
                    {order.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/orders/${order.id}`}
                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Order</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => reorder(order.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reorder for Demo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
