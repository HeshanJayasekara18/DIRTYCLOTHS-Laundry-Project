import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  
  Calendar, 
  MessageSquare, 
  Search,
  Filter,
  Clock,
  RefreshCw,
  Download,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

import Header from '../admin_header/AdminHeader';

// Mock Header component - replace with your actual import


const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [ setSelectedMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api' || 'https://dirtycloths-laundry-project-production.up.railway.app';

  // Fetch messages from database
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Ensure data has the expected structure
      const formattedMessages = data.map(message => ({
        contactID: message.contactID || message.id || message._id,
        name: message.name || 'Unknown',
        email: message.email || '',
        phone: message.phone || '',
        service: message.service || 'General Inquiry',
        message: message.message || message.content || '',
        timestamp: message.timestamp || message.createdAt || new Date().toISOString(),
        status: message.status || 'new',
        priority: message.priority || 'medium'
      }));

      setMessages(formattedMessages);
      setFilteredMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(`Failed to load messages: ${err.message}`);
      
      // Fallback to empty array or show error state
      setMessages([]);
      setFilteredMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Update message status
  const updateMessageStatus = async (contactID, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact${contactID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.contactID === contactID ? { ...msg, status: newStatus } : msg
      ));

      // Update selected message if it's the one being updated
      if (selectedMessage && selectedMessage.contactID === contactID) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error updating message status:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Delete message
  const deleteMessage = async (contactID) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact${contactID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setMessages(prev => prev.filter(msg => msg.contactID !== contactID));
      setSelectedMessages(prev => prev.filter(id => id !== contactID));
      
      // Close modal if the deleted message was selected
      if (selectedMessage && selectedMessage.contactID === contactID) {
        setShowModal(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert(`Failed to delete message: ${err.message}`);
    }
  };

  // Export messages
  const exportMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `messages-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting messages:', err);
      alert(`Failed to export messages: ${err.message}`);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search and status
  useEffect(() => {
    let filtered = messages;
    
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }
    
    setFilteredMessages(filtered);
  }, [searchTerm, filterStatus, messages]);

  const handleRefresh = () => {
    fetchMessages();
  };

  const handleStatusChange = (contactID, newStatus) => {
    updateMessageStatus(contactID, newStatus);
  };

  const handleDeleteMessage = (contactID) => {
    deleteMessage(contactID);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'replied': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Messages</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Customer Messages
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and respond to customer inquiries from DIRTYCLOTHS
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center shadow-lg"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button 
                  onClick={exportMessages}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <MessageSquare className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {messages.filter(m => m.status === 'new').length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Replied</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {messages.filter(m => m.status === 'replied').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {messages.filter(m => m.status === 'resolved').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages, names, emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {messages.length === 0 ? 'No messages yet' : 'No messages found'}
                  </h3>
                  <p className="text-gray-500">
                    {messages.length === 0 
                      ? 'Messages from customers will appear here.' 
                      : 'Try adjusting your search or filter criteria.'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.contactID}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {message.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {message.email}
                                </span>
                                {message.phone && (
                                  <span className="flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {message.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                              {message.service}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(message.status)}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                            <div className={`flex items-center ${getPriorityColor(message.priority)}`}>
                              {getPriorityIcon(message.priority)}
                              <span className="ml-1 text-sm font-medium capitalize">{message.priority}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-base leading-relaxed line-clamp-2">
                            {message.message}
                          </p>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(message.timestamp)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Quick status change functionality
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail Modal */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedMessage.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedMessage.name}</h3>
                      <p className="text-gray-600">{selectedMessage.email}</p>
                      {selectedMessage.phone && <p className="text-gray-600">{selectedMessage.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Service Requested</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedMessage.service}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Received</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(selectedMessage.timestamp)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Message</p>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-800 leading-relaxed">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-6">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleStatusChange(selectedMessage.contactID, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <button 
                      onClick={() => window.open(`mailto:${selectedMessage.email}`, '_blank')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Reply via Email
                    </button>

                    <button 
                      onClick={() => window.open(`https://wa.me/${selectedMessage.phone?.replace(/\s+/g, '')}`, '_blank')}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      disabled={!selectedMessage.phone}
                    >
                      WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        handleDeleteMessage(selectedMessage.contactID);
                      }}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;