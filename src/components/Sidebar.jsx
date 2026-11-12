
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  UserCheck,
  Building2,
  Pill,
  CalendarDays,
  ShoppingBag,
  ShoppingCart,
  ShieldAlert,
  User,
  SlidersHorizontal,
  HelpCircle,
  FileCheck,
  Bot,
  Bell,
  ClipboardList,
  Users,
  HeartPulse,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

export const Sidebar = () => {
  const { language, user, logout } = useApp();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  console.log('SIDEBAR USER:', user);

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const t = (key) => getTranslation(language, key);

  const navItems = [
    { to: '/home', labelKey: 'navHome', icon: Home },
    { to: '/doctors', labelKey: 'navDoctors', icon: UserCheck },
    { to: '/appointments', labelKey: 'navAppointments', icon: CalendarDays },
    { to: '/pharmacies', labelKey: 'navPharmacies', icon: Building2 },
    { to: '/medicines', labelKey: 'navMedicines', icon: Pill },
    { to: '/cart', labelKey: 'navCart', icon: ShoppingCart },
    { to: '/prescriptions', labelKey: 'navPrescriptions', icon: FileCheck },
    { to: '/orders', labelKey: 'navOrders', icon: ShoppingBag },
    { to: '/reminders', labelKey: 'navReminders', icon: Bell },
    { to: '/family', labelKey: 'navFamily', icon: Users },
    { to: '/health-records', labelKey: 'navRecords', icon: ClipboardList },
    { to: '/ai-assistant', labelKey: 'navAiAssistant', icon: Bot },
    { to: '/profile', labelKey: 'navProfile', icon: User },
    { to: '/help', labelKey: 'navHelp', icon: HelpCircle },
    { to: '/admin-demo', labelKey: 'navAdmin', icon: SlidersHorizontal },
  ];

  const fallbackLabels = {
    navEmergency: 'SOS Emergency (112)',
    navHome: 'Home Dashboard',
  };

  const getLabel = (key) => {
    const translated = t(key);
    if (translated === key) return fallbackLabels[key] || key;
    return translated;
  };

  return (
    <aside className="flex flex-col w-16 sm:w-64 h-screen sticky top-0 bg-white border-r border-slate-200 shrink-0 p-2 sm:p-4 overflow-y-auto">

      {/* Sidebar Brand */}
      <div className="mb-6 pb-5 border-b border-slate-200">
        <Link
          to={user ? (isAdmin ? '/admin-demo' : '/home') : '/login'}
          className="flex items-center gap-2 mb-5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>

          <span className="hidden sm:block text-xl font-black text-slate-900">
            Safe<span className="text-teal-700">Meds</span>
          </span>
        </Link>

        {/* SOS Button */}
        {!isAdmin && (
          <Link
            to="/emergency"
            className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">SOS Emergency</span>
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <div className="space-y-0.5">
        <p className="hidden sm:block px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="hidden sm:inline truncate">
                {getLabel(item.labelKey)}
              </span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-semibold text-sm"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}

        

      </div>
    </aside>
  );
};
