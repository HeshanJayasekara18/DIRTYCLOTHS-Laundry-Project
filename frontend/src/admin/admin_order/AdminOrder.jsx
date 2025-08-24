import AdminHeader  from "../admin_header/AdminHeader";




import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Calendar, MapPin, User, Phone, Mail, Package, Clock, DollarSign } from 'lucide-react';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    // Use the new admin endpoint
    const response = await fetch('http://localhost:5000/api/order/admin/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched orders:', data); // Debug log
    
    // Handle the response structure
    setOrders(data.orders || data || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem("token"); // Add this line
    
    const response = await fetch(`http://localhost:5000/api/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Add Authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      // Update local state
      setOrders(orders.map(order => 
        order.orderID === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Close modal if open
      if (selectedOrder && selectedOrder.orderID === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } else {
      console.error('Failed to update order status');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Header */}
          <AdminHeader/>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-600">Name:</span> {order.firstName} {order.lastName}</div>
              <div className="flex items-center"><Mail className="w-4 h-4 mr-1 text-gray-400" />{order.email}</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-1 text-gray-400" />{order.phone}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{order.city}, {order.postalCode}</div>
              <div className="col-span-2 flex items-start"><MapPin className="w-4 h-4 mr-1 text-gray-400 mt-0.5" />{order.address}</div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Service Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-600">Service:</span> {order.selectedService}</div>
              <div><span className="text-gray-600">Avarage Weight:</span> {order.weight} kg</div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-gray-400" />{order.preferredDate}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" />{order.preferredTime || 'Not specified'}</div>
              {order.addOns && order.addOns.length > 0 && (
                <div className="col-span-2">
                  <span className="text-gray-600">Add-ons:</span> {order.addOns.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
              <p className="text-sm text-gray-700">{order.specialInstructions}</p>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-600">Estimate Amount:</span> <span className="font-semibold">Rs.{order.totalAmount}</span></div>
              <div><span className="text-gray-600">Payment Method:</span> {order.paymentMethod || 'Cash'}</div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              {['pending', 'confirmed', 'processing', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(order.orderID, status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    order.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <AdminHeader />

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Orders will appear here when customers submit them.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{order.orderID}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium">{order.firstName} {order.lastName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="truncate">{order.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{order.city}</span>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{order.selectedService}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Weight:</span>
                      <span>{order.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-green-600">${order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{order.preferredDate} {order.preferredTime && `at ${order.preferredTime}`}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminOrder;