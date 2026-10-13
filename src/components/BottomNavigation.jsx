import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserCheck, Pill, ShoppingBag, User, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavigation = () => {
  const { cart } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/doctors', label: 'Doctors', icon: UserCheck },
    { to: '/emergency', label: 'SOS 112', icon: ShieldAlert, isEmergency: true },
    { to: '/medicines', label: 'Medicines', icon: Pill },
    { to: '/orders', label: 'Orders', icon: ShoppingBag, badge: cartCount },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          if (tab.isEmergency) {
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95 group`
                }
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
                      SOS
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
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors relative ${
                  isActive
                    ? 'text-teal-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    {tab.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-teal-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5">
                    {tab.label}
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
