import { UserModel } from '../../reg/UserModel';
import { useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    UserModel.clearSession();
    navigate("/login");
  };

  const navigateOrder = () => {
    navigate("/admin/order");   // ✅ use absolute path
  };

  const navigateHome = () => {
    navigate("/admin");         // ✅ already correct
  };

  const navigateMessage = () => {
    navigate("/admin/message"); // ✅ use absolute path
  };

  const handleAddPackage = () => {
    navigate("/admin/package-add"); // ✅ use absolute path
  };

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Laundry Admin Dashboard
            </h1>
            <p className="text-1xl font-bold mt-1 text-black space-x-4">
              <span onClick={navigateHome} className="cursor-pointer hover:underline">Home</span>
              <span onClick={navigateOrder} className="cursor-pointer hover:underline">Orders</span>
              <span onClick={navigateMessage} className="cursor-pointer hover:underline">Message</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddPackage}
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
};

export default AdminHeader;
