import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  UserCheck,
  Building2,
  Pill,
  FileText,
  CalendarDays,
  ShoppingBag,
  ShieldAlert,
  User,
  SlidersHorizontal,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/home', label: 'Home Dashboard', icon: Home },
    { to: '/emergency', label: 'SOS Emergency (112)', icon: ShieldAlert, highlight: true },
    { to: '/doctors', label: 'Find Doctors', icon: UserCheck },
    { to: '/appointments', label: 'My Appointments', icon: CalendarDays },
    { to: '/pharmacies', label: 'Local Pharmacies', icon: Building2 },
    { to: '/medicines', label: 'Order Medicines', icon: Pill },
    { to: '/prescriptions', label: 'Prescription Upload', icon: FileCheck },
    { to: '/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/profile', label: 'Patient Profile', icon: User },
    { to: '/help', label: 'Help & Support', icon: HelpCircle },
    { to: '/admin-demo', label: 'Admin Simulation', icon: SlidersHorizontal }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-80px)] p-4">
      <div className="space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                  item.highlight
                    ? isActive
                      ? 'bg-red-600 text-white shadow-sm shadow-red-500/20'
                      : 'text-red-700 bg-red-50 hover:bg-red-100/80 font-bold'
                    : isActive
                    ? 'bg-teal-50 text-teal-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  item.highlight ? 'text-current' : 'text-slate-500'
                }`}
              />
              <span>{item.label}</span>
              {item.highlight && (
                <span className="ml-auto text-[9px] bg-red-600/20 text-red-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  SOS
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
            <span className="text-[11px] font-bold text-teal-900">Prototype Active</span>
          </div>
          <p className="text-[10px] text-teal-700 leading-tight">
            Safe Meds combines emergency response, doctors, and pharmacy access in one system.
          </p>
        </div>
      </div>
    </aside>
  );
};
