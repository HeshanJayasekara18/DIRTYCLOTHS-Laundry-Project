import './App.css';

import Home from './home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Service from './service/Service';
import Orders from './orders/Orders';
import AboutUS from './about/AboutUs';
import ContactUs from './contactUS/ContactUS';
import UserProfile from './user_profile/UserProfile';
import LaundryOrderForm from './service/BookingForm';
import PackageAddForm from './admin/packageAddForm/PackageAddForm';

import Admin from './admin/Admin';
import AdminDashboard from './admin/admin_dashboard/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/services' element={<Service />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/about' element={<AboutUS />} />
        <Route path='/contactus' element={<ContactUs />} />
        <Route path='/userprofile' element={<UserProfile />} />
        <Route path='/laundry-book' element={<LaundryOrderForm />} />

        <Route path='/admin' element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path='package-add-form' element={<PackageAddForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;