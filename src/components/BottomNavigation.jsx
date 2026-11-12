import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserCheck, Building2, Pill, ShoppingBag, User, ShieldAlert, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavigation = () => {
  const { language, t } = useApp();

  const tabs = [
    { to: '/home', labelKey: 'navHome', icon: Home },
    { to: '/doctors', labelKey: 'navDoctors', icon: UserCheck },
    { to: '/emergency', label: 'SOS', icon: ShieldAlert, isEmergency: true },
    { to: '/pharmacies', labelKey: 'navPharmacies', icon: Building2 },
    { to: '/medicines', labelKey: 'navMedicines', icon: Pill },
    { to: '/profile', labelKey: 'navProfile', icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isEmergency) {
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="-mt-5 flex flex-col items-center justify-center transition-transform active:scale-95"
                aria-label="SOS Emergency"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 ${
                        isActive
                          ? 'bg-red-700 text-white border-white ring-2 ring-red-500'
                          : 'bg-red-600 text-white border-white shadow-red-500/30'
                      }`}
                    >
                      <ShieldAlert className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-red-600 mt-0.5 tracking-tight">
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-teal-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] tracking-tight mt-0.5">
                    {tab.label ?? t(tab.labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
