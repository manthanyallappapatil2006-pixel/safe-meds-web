
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { Toast } from './components/Toast';

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
import { NotFound } from './pages/NotFound';

// Shared application layout
const AppLayout = () => {
  const { toast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased">
      <Header />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-24 lg:pb-12 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <BottomNavigation />

      {toast && <Toast toast={toast} />}
    </div>
  );
};

// Opening the website:
// Logged-in users go to Home.
// Visitors go to Login.
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
          {/* Root route */}
          <Route path="/" element={<IndexRoute />} />

          {/* Authentication routes */}
          <Route path="/welcome" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Main application routes */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />

            <Route path="/emergency" element={<Emergency />} />
            <Route path="/emergency/history" element={<EmergencyHistory />} />

            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:doctorId" element={<DoctorDetails />} />
            <Route
              path="/appointments/book/:doctorId"
              element={<AppointmentBooking />}
            />
            <Route
              path="/appointments/confirmation"
              element={<AppointmentConfirmation />}
            />
            <Route path="/appointments" element={<Appointments />} />

            <Route path="/pharmacies" element={<Pharmacies />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route
              path="/medicines/:medicineId"
              element={<MedicineDetails />}
            />
            <Route path="/prescriptions" element={<Prescriptions />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/orders/confirmation"
              element={<OrderConfirmation />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Admin dashboard */}
            <Route path="/admin-demo" element={<AdminDashboard />} />

            {/* Unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
