
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Bell,
  ShoppingCart,
  User,
  SlidersHorizontal,
  HeartPulse,
  LogOut,
  ShieldCheck,
  Languages,
  Bot,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const {
    user,
    cart = [],
    unreadNotificationsCount = 0,
    logout,
    language,
    setLanguage,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navigate = useNavigate();

  const LANGUAGES = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'mr', label: 'मराठी', short: 'MR' },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    if (q.includes('pharm') || q.includes('store') || q.includes('chemist')) {
      navigate(`/pharmacies?q=${encodeURIComponent(q)}`);
    } else if (
      q.includes('tablet') ||
      q.includes('syrup') ||
      q.includes('paracetamol') ||
      q.includes('capsule') ||
      q.includes('band') ||
      q.includes('kit') ||
      q.includes('med')
    ) {
      navigate(`/medicines?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/doctors?q=${encodeURIComponent(q)}`);
    }

    setSearchQuery('');
  };

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

  const totalCartCount = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">

          {/* Logo */}
          <Link
            to={user ? (isAdmin ? '/admin-demo' : '/home') : '/login'}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Safe<span className="text-teal-700">Meds</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-md">
                  DEMO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`
              }
            >
              {t('navHome')}
            </NavLink>
            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`
              }
            >
              {t('navDoctors')}
            </NavLink>
            <NavLink
              id="header-nav-pharmacies"
              to="/pharmacies"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`
              }
            >
              {t('navPharmacies')}
            </NavLink>
            <NavLink
              id="header-nav-medicines"
              to="/medicines"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`
              }
            >
              {t('navMedicines')}
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`
              }
            >
              {t('navAppointments')}
            </NavLink>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs xl:max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Language Selector */}
            <div className="relative">
              <button
                id="btn-language-toggle"
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                onBlur={() => setTimeout(() => setLangMenuOpen(false), 150)}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                aria-label="Select language"
              >
                <Languages className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden sm:inline">{currentLang.short}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl border border-slate-200 shadow-lg z-50 py-1 overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      id={`btn-lang-${lang.code}`}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left transition-colors ${
                        language === lang.code
                          ? 'bg-teal-50 text-teal-800'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      )}
                      {language !== lang.code && <span className="w-1.5 h-1.5 shrink-0" />}
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SOS button: normal users only */}
            {!isAdmin && (
              <Link
                to="/emergency"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                title="Emergency SOS Simulation"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t('sosLabel')}</span>
              </Link>
            )}

            {/* Admin dashboard shortcut */}
            {user && isAdmin && (
              <Link
                to="/admin-demo"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Admin login shortcut when signed out */}
            {!user && (
              <Link
                to="/admin-login"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}

            {/* AI Assistant shortcut */}
            {user && !isAdmin && (
              <Link
                to="/ai-assistant"
                className="hidden sm:inline-flex p-2 text-slate-600 hover:text-teal-700 rounded-xl hover:bg-teal-50 transition-colors"
                title="Aarogya AI Assistant"
              >
                <Bot className="w-5 h-5" />
              </Link>
            )}

            {/* Cart and notifications */}
            {user && !isAdmin && (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-slate-600 hover:text-teal-700 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">
                      {totalCartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  className="relative p-2 text-slate-600 hover:text-teal-700 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User info + logout / sign in */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800">{user.name || 'User'}</p>
                  <p className={`text-[10px] font-semibold ${isAdmin ? 'text-teal-700' : 'text-slate-500'}`}>
                    {isAdmin ? 'Administrator' : user.isGuest ? 'Guest Demo' : 'Member'}
                  </p>
                </div>

                {!isAdmin && (
                  <Link
                    to="/profile"
                    className="p-2 text-slate-600 hover:text-teal-700 rounded-xl hover:bg-slate-50 transition-colors"
                    title="View Profile"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                <button
                  id="btn-logout"
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
