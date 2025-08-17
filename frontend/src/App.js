import { useEffect } from 'react';
import './App.css';
import Home from './home/Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Service from './service/Service';
import Orders from './orders/Orders';
import AboutUS from './about/AboutUs';
import ContactUs from './contactUS/ContactUS';
import UserProfile from './user_profile/UserProfile';
import LaundryOrderForm from './service/BookingForm';
import PackageAddForm from './admin/packageAddForm/PackageAddForm';
import AdminDashboard from './admin/admin_dashboard/AdminDashboard';
import AdminOrder from './admin/admin_order/AdminOrder';
import Register from './reg/Register';
import Login from './reg/Login';
import PreServiceDetails from './service/pre-service-details/PreServiceDetails';
import { AdminProtectedRoute, ProtectedRoute } from './admin/AdminProtectedRoute';

function App() {
  useEffect(() => {
    // Always clear any saved login info when in development
    if (process.env.NODE_ENV === 'development') {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUS />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/services" element={<Service />} />
        <Route path="/service-details" element={<PreServiceDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected user pages */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userprofile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/laundry-book"
          element={
            <ProtectedRoute>
              <LaundryOrderForm />
            </ProtectedRoute>
          }
        />

        {/* Admin protected routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/order"
          element={
            <AdminProtectedRoute>
              <AdminOrder />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/package-add"
          element={
            <AdminProtectedRoute>
              <PackageAddForm />
            </AdminProtectedRoute>
          }
        />

        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
