import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  FileCheck,
  ShieldAlert,
  Trash2,
  Check,
  ArrowRight,
  Filter
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useApp();
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread'

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-teal-700" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'prescription':
        return <FileCheck className="w-4 h-4 text-purple-600" />;
      case 'emergency':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500">
            Simulated appointment alerts, order updates, and healthcare notifications
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {notifications.some((n) => !n.read) && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {['All', 'Unread'].map((f) => {
          const count =
            f === 'All'
              ? notifications.length
              : notifications.filter((n) => !n.read).length;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === f
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{f}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filter === f
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

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'Unread' ? 'No unread notifications' : 'No notifications'}
          description="You are completely caught up on your healthcare updates."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-white border-slate-200 opacity-80'
                  : 'bg-teal-50/40 border-teal-200 shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {notif.createdAt}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {notif.message}
                </p>

                <div className="flex items-center gap-3 text-xs">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => markAsRead(notif.id)}
                      className="font-bold text-teal-700 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notif.id)}
                      className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    className="text-red-500 hover:text-red-700 text-[11px] font-semibold ml-auto cursor-pointer"
                  >
                    Delete
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
