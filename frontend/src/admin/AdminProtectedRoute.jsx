import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserController } from '../reg/UserController';

// Protected Route Component for Admin Pages
const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = UserController.isAuthenticated();
  const isAdmin = UserController.isAdmin();
  
  // Check if user is logged in
  if (!isAuthenticated) {
    // Store the intended path for after login
    sessionStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user is admin
  if (!isAdmin) {
    console.log("Access denied: Admin privileges required");
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// General Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = UserController.isAuthenticated();
  
  if (!isAuthenticated) {
    sessionStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export { AdminProtectedRoute, ProtectedRoute };