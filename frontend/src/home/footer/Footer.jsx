import React from "react"; 
import logo from '../../images/DIRTYCLOTHS.png';

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Tagline */}
        <div className="mb-8">
          <div className="flex items-center">
            <img
              src={logo}
              height={200}
              width={300}
              alt="DirtyCloths Laundry Logo"   // ✅ Added alt prop
            />
          </div>
          <p className="text-gray-700 mt-2">
            Your trusted laundry partner in Midigama – fast, tourist-friendly, and eco-conscious service.
          </p>
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li className="border-l-2 border-gray-800 pl-3">
                <a href="#" className="text-gray-800 hover:text-blue-500">Home</a>
              </li>
              <li className="border-l-2 border-gray-800 pl-3">
                <a href="#" className="text-gray-800 hover:text-blue-500">Services</a>
              </li>
              <li className="border-l-2 border-gray-800 pl-3">
                <a href="#" className="text-gray-800 hover:text-blue-500">Pricing</a>
              </li>
              <li className="border-l-2 border-gray-800 pl-3">
                <a href="#" className="text-gray-800 hover:text-blue-500">About Us</a>
              </li>
              <li className="border-l-2 border-gray-800 pl-3">
                <a href="#" className="text-gray-800 hover:text-blue-500">Contact</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Social Media</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-800 hover:text-blue-500">Facebook</a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-blue-500">Instagram</a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-blue-500">WhatsApp</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">📍</span>
                <span>Location: Midigama, Sri Lanka</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 mr-2">📱</span>
                <span>Phone: +94 77 123 4567</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">✉️</span>
                <span>Email: support@dirtycloths.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-600">
          © 2025 DirtyClouths Laundry Service. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
