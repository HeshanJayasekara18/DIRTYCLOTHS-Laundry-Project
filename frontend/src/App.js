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
import Admin from './admin/Admin';
import AdminDashboard from './admin/admin_dashboard/AdminDashboard';
import Register from './reg/Register';
import Login from './reg/Login';
import PreServiceDetails from './service/pre-service-details/PreServiceDetails';
import { AdminProtectedRoute, ProtectedRoute } from './admin/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/service-details" element={<PreServiceDetails />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Service />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/about" element={<AboutUS />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/laundry-book" element={<LaundryOrderForm />} />

        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/*" 
          element={
            <AdminProtectedRoute>
              <AdminRoutes />
            </AdminProtectedRoute>
          } 
        />

        {/* Redirect unauthenticated users to login, authenticated to home */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;