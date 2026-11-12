import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  UserCheck,
  Pill,
  Calendar,
  ShoppingBag,
  FileText,
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Building2,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { DoctorCard } from '../components/DoctorCard';
import { PharmacyCard } from '../components/PharmacyCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { healthTips } from '../data/initialData';
import { formatCurrency, formatDate } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const Home = () => {
  const { user, appointments, orders, doctors, pharmacies, emergencyContacts, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const upcomingAppointment = appointments.find((a) => a.status === 'Upcoming');
  const recentOrder = orders.length > 0 ? orders[0] : null;
  const primaryEmergencyContact = emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const q = searchTerm.trim().toLowerCase();
    if (q.includes('pharm') || q.includes('chemist')) {
      navigate(`/pharmacies?q=${encodeURIComponent(q)}`);
    } else if (
      q.includes('tablet') ||
      q.includes('pain') ||
      q.includes('med') ||
      q.includes('kit') ||
      q.includes('syrup')
    ) {
      navigate(`/medicines?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/doctors?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/60 backdrop-blur-xs text-teal-100 text-xs font-semibold mb-3 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome to Safe Meds Healthcare Prototype</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Hello, {user ? user.name : 'Welcome Back!'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mb-6 max-w-xl leading-relaxed">
            Your unified portal combining rapid simulated emergency assistance, specialized doctor appointments, and neighborhood pharmacy delivery.
          </p>

          {/* Quick Search inside banner */}
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors, medicines, or pharmacies..."
                className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Primary 4 Service Cards */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {t('navHome') || 'Core Healthcare Services'}
          </h2>
          <span className="text-xs text-slate-500 font-medium">All in One Place</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ServiceCard
            icon={ShieldAlert}
            title={t('navEmergency') || 'SOS Emergency'}
            description="Immediate emergency assistance simulation, geolocation dispatch demo, and India helpline 112."
            buttonText="Get Emergency Help"
            to="/emergency"
            variant="emergency"
          />

          <ServiceCard
            icon={UserCheck}
            title={t('navDoctors') || 'Find a Doctor'}
            description="Browse 8+ medical specialties, inspect doctor qualifications, and reserve clinic or virtual slots."
            buttonText="Explore Doctors"
            to="/doctors"
            variant="blue"
          />

          <ServiceCard
            icon={Building2}
            title={t('navPharmacies') || 'Local Pharmacies'}
            description="Locate nearby verified chemists, check operating hours, delivery coverage, and phone contacts."
            buttonText="Find Pharmacies"
            to="/pharmacies"
            variant="teal"
          />

          <ServiceCard
            icon={Pill}
            title={t('navMedicines') || 'Medicines Info'}
            description="Educational medicine guide, dosage forms, uses, and personal reference list."
            buttonText="Browse Guide"
            to="/medicines"
            variant="teal"
          />
        </div>
      </section>

      {/* Emergency Contact & 112 Hotline Callout */}
      <section className="bg-red-50/70 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-red-950">
                National Emergency Dispatch: Call 112
              </h3>
              <span className="text-[10px] bg-red-200 text-red-900 font-bold px-2 py-0.2 rounded-full">
                Toll Free
              </span>
            </div>
            <p className="text-xs text-red-800 mt-0.5">
              In real-life medical emergencies, immediately dial <strong>112</strong>. Safe Meds is a student demo.
              {primaryEmergencyContact && (
                <span className="block sm:inline sm:ml-2 font-medium">
                  • Saved contact: {primaryEmergencyContact.name} ({primaryEmergencyContact.phone})
                </span>
              )}
            </p>
          </div>
        </div>

        <Link
          to="/emergency"
          className="shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          Open SOS Module
        </Link>
      </section>

      {/* Activity Overview: Upcoming Appointment & Recent Order */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Appointment Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Upcoming Appointment
              </h3>
            </div>
            <Link
              to="/appointments"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {upcomingAppointment.doctorName}
                  </h4>
                  <p className="text-xs text-teal-700 font-medium">
                    {upcomingAppointment.specialty}
                  </p>
                </div>
                <StatusBadge status={upcomingAppointment.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-white p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(upcomingAppointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{upcomingAppointment.appointmentTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Type: {upcomingAppointment.consultationType}
                </span>
                <Link
                  to="/appointments"
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  Manage Appointment →
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming consultations"
              description="You have no scheduled doctor visits right now."
              actionText="Book an Appointment"
              onAction={() => navigate('/doctors')}
            />
          )}
        </div>

        {/* Recent Medicine Order Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Recent Medicine Order
              </h3>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrder ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Order #{recentOrder.id}
                  </h4>
                  <p className="text-xs text-slate-500">
                    From {recentOrder.pharmacyName}
                  </p>
                </div>
                <StatusBadge status={recentOrder.demoStatus} />
              </div>

              <div className="text-xs text-slate-600 mb-3">
                <p className="line-clamp-1 text-[11px]">
                  {recentOrder.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">
                    Total: {formatCurrency(recentOrder.total)}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {recentOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              <Link
                to={`/orders/${recentOrder.id}`}
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors"
              >
                Track Live Demo Delivery
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="No previous orders"
              description="You have not placed any medicine orders yet."
              actionText="Browse Medicines"
              onAction={() => navigate('/medicines')}
            />
          )}
        </div>
      </section>

      {/* Featured Doctors Preview */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Consult Top Specialists
            </h2>
            <p className="text-xs text-slate-500">Verified doctor directory sample profiles</p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.slice(0, 3).map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      {/* Nearby Pharmacies Section */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Nearby Pharmacies
            </h2>
            <p className="text-xs text-slate-500">Fast delivery from neighborhood chemists</p>
          </div>
          <Link
            to="/pharmacies"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>All Pharmacies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pharmacies.slice(0, 3).map((pharmacy) => (
            <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
          ))}
        </div>
      </section>

      {/* Quick Prescription Upload Shortcut */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-700/60 text-purple-200 flex items-center justify-center shrink-0 border border-purple-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold">Have a Doctor's Prescription?</h3>
            <p className="text-xs text-purple-200 mt-0.5 max-w-lg leading-relaxed">
              Upload prescription images or PDFs for simulated pharmacist review and automated medicine dispatch.
            </p>
          </div>
        </div>

        <Link
          to="/prescriptions"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-purple-950 hover:bg-purple-50 text-xs font-bold transition-all shadow-xs"
        >
          Upload Prescription (Demo)
        </Link>
      </section>

      {/* Health Education Section (Section 30) */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-teal-700" />
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Health Education & Safety Guidelines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {healthTips.slice(0, 3).map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-200 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-teal-700 mb-2">
                <span>{tip.tag}</span>
                <span className="text-slate-400 font-normal">{tip.readTime}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                {tip.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {tip.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
