import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, CheckCircle2, Loader2, Droplets, Wind, Iron } from 'lucide-react';
import Navbar from '../common/navbar/Navbar';
import Footer from '../home/footer/Footer';


const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState({
    active: [],
    past: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setOrders({
        active: [
          {
            id: 'ORD-2025',
            date: '2025-05-18',
            status: 'in-progress',
            service: 'Full Laundry + Ironing',
            items: 12,
            amount: 35.00,
            dropOff: '2025-05-18T10:30:00',
            estimatedPickup: '2025-05-20T17:00:00',
            stage: 'washing',
            progress: 50,
            stageSequence: ['received', 'sorting', 'washing', 'drying', 'ironing']
          },
          {
            id: 'ORD-2024',
            date: '2025-05-17',
            status: 'in-progress',
            service: 'Dry Cleaning',
            items: 3,
            amount: 42.50,
            dropOff: '2025-05-17T14:15:00',
            estimatedPickup: '2025-05-21T12:00:00',
            stage: 'ironing',
            progress: 80,
            stageSequence: ['received', 'sorting', 'cleaning', 'ironing', 'ready']
          }
        ],
        past: [
          {
            id: 'ORD-2016',
            date: '2025-05-10',
            status: 'completed',
            service: 'Wash & Fold',
            items: 8,
            amount: 24.00,
            dropOff: '2025-05-10T09:45:00',
            pickup: '2025-05-12T11:20:00'
          },
          {
            id: 'ORD-2010',
            date: '2025-05-05',
            status: 'cancelled',
            service: 'Premium Ironing',
            items: 5,
            amount: 18.50,
            dropOff: '2025-05-05T15:30:00',
            cancellation: '2025-05-05T16:15:00'
          },
          {
            id: 'ORD-2004',
            date: '2025-04-28',
            status: 'completed',
            service: 'Full Laundry + Ironing',
            items: 15,
            amount: 42.75,
            dropOff: '2025-04-28T10:00:00',
            pickup: '2025-04-30T18:15:00'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'received': return <CheckCircle2 className="w-5 h-5" />;
      case 'sorting': return <Loader2 className="w-5 h-5" />;
      case 'washing': return <Droplets className="w-5 h-5" />;
      case 'cleaning': return <Droplets className="w-5 h-5" />;
      case 'drying': return <Wind className="w-5 h-5" />;
      // Using Settings as a fallback
      case 'ready': return <CheckCircle className="w-5 h-5" />;
      default: return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex justify-between items-center"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 border-b border-gray-200"
        >
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 relative font-medium text-sm ${
                activeTab === 'active'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              } transition-colors duration-300`}
            >
              Active Orders
              {activeTab === 'active' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 relative font-medium text-sm ${
                activeTab === 'past'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-transparent'
              } transition-colors duration-300`}
            >
              Past Orders
              {activeTab === 'past' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-24"
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'active' ? (
              <motion.div
                key="active-orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {orders.active.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.active.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1 + 0.4
                        }}
                        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                            <span className="font-semibold text-blue-600">#{order.id}</span>
                            <span className="text-gray-500 text-sm">{formatDate(order.date)}</span>
                          </div>
                          
                          <div className="mb-4">
                            <div className={`flex items-center space-x-2 ${getStatusColor(order.status)} text-white text-sm py-1 px-3 rounded-full w-fit`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Service</span>
                              <span className="font-medium">{order.service}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Items</span>
                              <span className="font-medium">{order.items} pieces</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Amount</span>
                              <span className="font-medium">${order.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Drop-off</span>
                              <span className="font-medium">{formatDateTime(order.dropOff)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Est. Pickup</span>
                              <span className="font-medium">{formatDateTime(order.estimatedPickup)}</span>
                            </div>
                          </div>
                          
                          {/* Progress Tracker */}
                          <div className="mb-8">
                            <div className="relative">
                              <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${order.progress}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                />
                              </div>
                              <div className="flex justify-between">
                                {order.stageSequence.map((stage, stageIndex) => {
                                  const stageComplete = order.stageSequence.indexOf(order.stage) >= stageIndex;
                                  const isCurrentStage = order.stage === stage;
                                  
                                  return (
                                    <div key={stage} className="relative flex flex-col items-center">
                                      <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                          duration: 0.3,
                                          delay: index * 0.1 + stageIndex * 0.15 + 0.8
                                        }}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                          stageComplete 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-white border-2 border-gray-200 text-gray-400'
                                        } ${isCurrentStage ? 'ring-4 ring-blue-100' : ''}`}
                                      >
                                        {getStageIcon(stage)}
                                        {isCurrentStage && (
                                          <motion.div
                                            animate={{ 
                                              scale: [1, 1.2, 1], 
                                              opacity: [0.8, 1, 0.8]
                                            }}
                                            transition={{ 
                                              duration: 2, 
                                              repeat: Infinity,
                                              ease: "easeInOut" 
                                            }}
                                            className="absolute inset-0 rounded-full bg-blue-200 -z-10"
                                          />
                                        )}
                                      </motion.div>
                                      <span className={`absolute -bottom-6 text-xs whitespace-nowrap ${
                                        isCurrentStage ? 'font-semibold text-blue-600' : 'text-gray-500'
                                      }`}>
                                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-4 pt-4 mt-4 border-t border-gray-100">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                              <span>Track Order</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors duration-300">
                              Cancel Order
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow p-8 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Orders</h3>
                      <p className="text-gray-500 mb-6">You don't have any active orders at the moment.</p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-300">
                        Place New Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="past-orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {orders.past.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.past.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1 + 0.4
                        }}
                        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                            <span className="font-semibold text-blue-600">#{order.id}</span>
                            <span className="text-gray-500 text-sm">{formatDate(order.date)}</span>
                          </div>
                          
                          <div className="mb-4">
                            <div className={`flex items-center space-x-2 ${getStatusColor(order.status)} text-white text-sm py-1 px-3 rounded-full w-fit`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Service</span>
                              <span className="font-medium">{order.service}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Items</span>
                              <span className="font-medium">{order.items} pieces</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Amount</span>
                              <span className="font-medium">${order.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-sm">Drop-off</span>
                              <span className="font-medium">{formatDateTime(order.dropOff)}</span>
                            </div>
                            {order.pickup && (
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Pickup</span>
                                <span className="font-medium">{formatDateTime(order.pickup)}</span>
                              </div>
                            )}
                            {order.cancellation && (
                              <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Cancellation</span>
                                <span className="font-medium">{formatDateTime(order.cancellation)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-4 pt-4 mt-4 border-t border-gray-100">
                            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg transition-colors duration-300">
                              View Details
                            </button>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                              Reorder
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow p-8 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Order History</h3>
                      <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-300">
                        Place First Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
      <Footer/>
    </div>
  );
};

export default Orders;