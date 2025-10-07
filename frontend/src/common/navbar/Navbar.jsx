import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from '../../images/DIRTYCLOTHS.png';
import { UserModel } from "../../reg/UserModel";
import NavbarProfileImage from "./NavbarProfileimage";

// Navigation items - defined outside component to avoid recreation on each render
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Orders', href: '/orders' },
  { name: 'About us', href: '/about' },
  { name: 'Contact us', href: '/contactus' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get current location from React Router
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Check if user is logged in
  const session = UserModel.getSession();
  const isLoggedIn = !!session && !!session.token;

  // Logout handler
  const handleLogout = () => {
    UserModel.clearSession();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          {/* Logo section */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="DIRTYCLOTHS"
              className="h-10 md:h-14 w-auto"
            />
          </div>

          {/* Navigation section */}
          <div className="hidden md:flex md:items-center md:justify-center flex-grow">
            <div className="flex space-x-8">
              {navigationItems.map((item) => {
                // Hide "Orders" if not logged in
                if (item.name === "Orders" && !isLoggedIn) return null;
                // Hide "Services" if not logged in
                if (item.name === "Services" && !isLoggedIn) return null;
                const isCurrent =
                  item.href === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrent
                        ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                        : 'text-gray-800 hover:text-blue-500 hover:border-b-2 hover:border-blue-500'
                    } px-1 py-2 text-base transition-colors duration-200`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {/* Show "Service Details" only if not logged in */}
              {!isLoggedIn && (
                <Link
                  to="/service-details"
                  className="text-gray-800 hover:text-blue-500 px-1 py-2 text-base transition-colors duration-200"
                >
                  Service Details
                </Link>
              )}
            </div>
          </div>

          {/* Right side: Profile or Login/Register */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              // Profile dropdown code
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <NavbarProfileImage/>
                </button>
                {/* Profile dropdown menu */}
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link 
                      to="/userprofile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)} // Close dropdown when clicked
                    >
                      Your Profile
                    </Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
        {/* Modern Gradient Style */}
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="group relative px-6 py-3 font-medium text-white transition-all duration-300 ease-out hover:scale-105"
          >
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-700 group-hover:shadow-lg"></span>
            <span className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </span>
          </a>
          <a
            href="/register"
            className="group relative px-6 py-3 font-medium text-gray-800 transition-all duration-300 ease-out hover:scale-105"
          >
            <span className="absolute inset-0 rounded-lg border-2 border-gray-800 transition-all duration-300 group-hover:bg-gray-800 group-hover:shadow-lg"></span>
            <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register
            </span>
          </a>
        </div>
      </>
            )}
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              // Use the same current path logic for mobile menu
              const isCurrent = 
                item.href === '/' 
                  ? currentPath === '/' 
                  : currentPath.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isCurrent
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500 hover:border-l-4 hover:border-blue-500'
                  } block px-3 py-3 rounded-md text-base font-medium transition-all duration-200`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}