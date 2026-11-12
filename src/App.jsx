
import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import DoctorPrescription from './pages/DoctorPrescription';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorRoute from './components/DoctorRoute';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { Toast } from './components/Toast';
import { AdminRoute } from './components/AdminRoute';
import { FloatingAiWidget } from './components/FloatingAiWidget';

// Authentication pages
import { Login } from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

// Application pages
import { Home } from './pages/Home';
import { Emergency } from './pages/Emergency';
import { EmergencyHistory } from './pages/EmergencyHistory';
import { Doctors } from './pages/Doctors';
import { DoctorDetails } from './pages/DoctorDetails';
import { AppointmentBooking } from './pages/AppointmentBooking';
import { AppointmentConfirmation } from './pages/AppointmentConfirmation';
import { Appointments } from './pages/Appointments';
import { Pharmacies } from './pages/Pharmacies';
import { Medicines } from './pages/Medicines';
import { MedicineDetails } from './pages/MedicineDetails';
import { Prescriptions } from './pages/Prescriptions';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Orders } from './pages/Orders';
import { OrderDetails } from './pages/OrderDetails';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { Notifications } from './pages/Notifications';
import { Help } from './pages/Help';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { AdminDashboard } from './pages/AdminDashboard';
import { AiAssistant } from './pages/AiAssistant';
import { NotFound } from './pages/NotFound';

// Additional pages (may be lazy-loaded as they're supplemental)
import { MedicineReminders } from './pages/MedicineReminders';
import { FamilyProfiles } from './pages/FamilyProfiles';
import { HealthRecords } from './pages/HealthRecords';
import { Presentation } from './pages/Presentation';

// Shared application layout

const AppLayout = () => {
  const { toast } = useApp();

  return (
    <div className="h-screen bg-slate-50 flex text-slate-900 antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Floating AI Assistant Widget */}
      <FloatingAiWidget />

      {toast && <Toast toast={toast} />}
    </div>
  );
};
// Root redirect — logged-in → /home, visitor → /login
const IndexRoute = () => {
  const { user } = useApp();
  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<IndexRoute />} />

          {/* Auth */}
          <Route path="/welcome" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Main app — wrapped in AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />

            {/* Emergency */}
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/emergency/history" element={<EmergencyHistory />} />

            {/* Doctors & appointments */}
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:doctorId" element={<DoctorDetails />} />
            <Route path="/appointments/book/:doctorId" element={<AppointmentBooking />} />
            <Route path="/appointments/confirmation" element={<AppointmentConfirmation />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
  path="/doctor-dashboard"
  element={
    <DoctorRoute>
      <DoctorDashboard />
    </DoctorRoute>
  }
/>
<Route
  path="/doctor-prescription/:appointmentId"
  element={
    <DoctorRoute>
      <DoctorPrescription />
    </DoctorRoute>
  }
/>
<Route
  path="/doctor-prescription/edit/:prescriptionId"
  element={
    <DoctorRoute>
      <DoctorPrescription />
    </DoctorRoute>
  }
/>
            {/* Pharmacy & medicines (informational) */}
            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicines/:medicineId" element={<MedicineDetails />} />

            {/* Prescriptions */}
            <Route path="/prescriptions" element={<Prescriptions />} />

            {/* Cart & orders */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />

            {/* Health management */}
            <Route path="/reminders" element={<MedicineReminders />} />
            <Route path="/family" element={<FamilyProfiles />} />
            <Route path="/health-records" element={<HealthRecords />} />

            {/* AI Assistant */}
            <Route path="/ai-assistant" element={<AiAssistant />} />

            {/* Profile & settings */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Info pages */}
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/presentation" element={<Presentation />} />

            {/* Admin — strictly protected by backend/role check */}
            <Route
              path="/admin-demo"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
