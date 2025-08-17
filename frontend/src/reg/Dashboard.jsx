import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from './Register'; 
import UserModel from './Register'; // Assuming UserModel is in the same directory
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = UserModel.getSession();
    if (!session.user) {
      navigate('/login');
    } else {
      setUser(session.user);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Welcome, {user.email}!</h2>
        <button
          onClick={() => UserController.handleLogout(navigate)}
          className="w-full bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;