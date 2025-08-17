import { UserModel } from '../../reg/UserModel';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {Plus} from 'lucide-react';

const AdminHeader = () => {

    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);


    const handleLogout = () => {
    UserModel.clearSession();
    navigate("/login");
    };
    const navigateorder = () => {
        navigate("./order");
    };

    const navigatehome = () => {
        navigate("/admin");
    };
  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Laundry Admin Dashboard</h1>
              <p className="text-1xl font-bold mt-1  text-black ">
                <span onClick={(navigateorder)}>Orders </span>
              <span onClick={(navigatehome)}>Home </span></p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span>Add Package</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
export default AdminHeader;