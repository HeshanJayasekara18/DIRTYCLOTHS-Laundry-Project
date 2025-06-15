
import './App.css';

import Home from './home/Home';
import {BrowserRouter,Route,Routes}from 'react-router-dom';
import Service from './service/Service'
import Orders from './orders/Orders'
import AboutUS from './about/AboutUs'
import ContactUs from './contactUS/ContactUS';
import UserProfile from './user_profile/UserProfile';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
