import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Home, 
  Briefcase, 
  Heart, 
  Trash2,
  Star,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const Addresstab = ({ user, setUser, error, setError, success, setSuccess }) => {
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    label: 'home',
    address: '',
    lat: '',
    lng: '',
    isDefault: false
  });
  
  const validAddressLabels = ['home', 'work', 'favorite', 'other'];

  // Get token from localStorage without immediate redirect
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Check if user is authenticated for API calls (with redirect)
  const checkAuthForAPI = () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };

  // API call helper
  const apiCall = useCallback(async (url, options = {}) => {
    const token = getToken();
    if (!token) return null;

    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers
        }
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return null;
      }

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid response format');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }, [API_BASE_URL, navigate]);

  // Add address
  const addAddress = async () => {
    if (!checkAuthForAPI()) return;

    try {
      setError('');
      
      if (!addressForm.address.trim()) {
        setError('Address is required');
        return;
      }
      
      if (!validAddressLabels.includes(addressForm.label)) {
        setError(`Invalid label. Must be one of: ${validAddressLabels.join(', ')}`);
        return;
      }
      
      if (addressForm.lat && (isNaN(addressForm.lat) || addressForm.lat < -90 || addressForm.lat > 90)) {
        setError('Latitude must be between -90 and 90');
        return;
      }
      
      if (addressForm.lng && (isNaN(addressForm.lng) || addressForm.lng < -180 || addressForm.lng > 180)) {
        setError('Longitude must be between -180 and 180');
        return;
      }
      
      const data = await apiCall('/api/auth/user/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label: addressForm.label,
          address: addressForm.address.trim(),
          lat: addressForm.lat || undefined,
          lng: addressForm.lng || undefined,
          isDefault: addressForm.isDefault
        })
      });

      if (data) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        setAddressForm({
          label: 'home',
          address: '',
          lat: '',
          lng: '',
          isDefault: false
        });
        setShowAddressForm(false);
        setSuccess('Address added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to add address');
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    if (!checkAuthForAPI()) return;
    
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setError('');
      const data = await apiCall(`/api/auth/user/addresses/${addressId}`, {
        method: 'DELETE'
      });
      
      if (data) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        setSuccess('Address deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete address');
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    if (!checkAuthForAPI()) return;
    
    try {
      setError('');
      const data = await apiCall(`/api/auth/user/addresses/${addressId}/default`, {
        method: 'PUT'
      });
      
      if (data) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        setSuccess('Default address updated!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to set default address');
    }
  };

  // Get address icon
  const getAddressIcon = (label) => {
    switch (label) {
      case 'home': return <Home size={20} className="text-blue-600" />;
      case 'work': return <Briefcase size={20} className="text-green-600" />;
      case 'favorite': return <Heart size={20} className="text-red-600" />;
      default: return <MapPin size={20} className="text-gray-600" />;
    }
  };

  // Get address label display name
  const getAddressLabelDisplay = (label) => {
    switch (label) {
      case 'home': return 'Home';
      case 'work': return 'Work';
      case 'favorite': return 'Favorite';
      case 'other': return 'Other';
      default: return label;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Messages for Address Tab */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
          <AlertCircle size={20} className="text-red-500" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
          <CheckCircle size={20} className="text-green-500" />
          <div>
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Addresses Tab */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Saved Addresses</h3>
            <p className="text-slate-600 mt-1">Manage your delivery addresses</p>
          </div>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={16} />
            Add New Address
          </button>
        </div>

        {/* Add Address Form */}
        {showAddressForm && (
          <div className="mb-8 p-6 bg-slate-50/50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-6">Add New Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Address Type</label>
                <select
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                >
                  {validAddressLabels.map(label => (
                    <option key={label} value={label}>
                      {getAddressLabelDisplay(label)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Address *</label>
                <input
                  type="text"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Latitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={addressForm.lat}
                  onChange={(e) => setAddressForm({...addressForm, lat: e.target.value})}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter latitude (-90 to 90)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={addressForm.lng}
                  onChange={(e) => setAddressForm({...addressForm, lng: e.target.value})}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter longitude (-180 to 180)"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Set as default address</span>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={addAddress}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Add Address
              </button>
              <button
                onClick={() => setShowAddressForm(false)}
                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {user?.addresses?.length > 0 ? (
            user.addresses.map((address, index) => (
              <div key={address._id || index} className="bg-slate-50/50 rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getAddressIcon(address.label)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900 capitalize">
                          {getAddressLabelDisplay(address.label)}
                        </h4>
                        {address.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Star size={12} />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mb-2">{address.address}</p>
                      {(address.lat || address.lng) && (
                        <p className="text-sm text-slate-500">
                          Coordinates: {address.lat || 'N/A'}, {address.lng || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address._id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(address._id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No addresses saved yet</p>
              <p className="text-sm mt-2">Add your first address to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresstab;