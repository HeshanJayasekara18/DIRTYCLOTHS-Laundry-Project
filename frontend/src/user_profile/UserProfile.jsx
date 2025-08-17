import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  MapPin, 
  Home, 
  Briefcase, 
  Heart, 
  Eye, 
  EyeOff,
  Camera,
  ArrowLeft,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Trash2,
  Star
} from 'lucide-react';
import Navbar from '../common/navbar/Navbar';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    mobile: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [addressForm, setAddressForm] = useState({
    label: 'home',
    address: '',
    lat: '',
    lng: '',
    isDefault: false
  });

  // Configuration - Use environment variable with fallback
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const validAddressLabels = ['home', 'work', 'favorite', 'other'];
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // API call helper
  const apiCall = async (url, options = {}) => {
    const token = getToken();
    
    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        }
      });

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
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall('/api/auth/user');
      setUser(data);
      setProfileForm({
        name: data.name || '',
        mobile: data.mobile || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async () => {
    if (!profileForm.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setError('');
      const data = await apiCall('/api/auth/user', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      setUser(prev => ({ ...prev, ...data }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      setError('');
      
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setError('All password fields are required');
        return;
      }
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (passwordForm.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      
      await apiCall('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
      setShowPasswordForm(false);
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  // Add address
  const addAddress = async () => {
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
    } catch (err) {
      setError(err.message || 'Failed to add address');
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setError('');
      const data = await apiCall(`/api/auth/user/addresses/${addressId}`, {
        method: 'DELETE'
      });
      setUser(prev => ({ ...prev, addresses: data.addresses }));
      setSuccess('Address deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete address');
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      setError('');
      const data = await apiCall(`/api/auth/user/addresses/${addressId}/default`, {
        method: 'PUT'
      });
      setUser(prev => ({ ...prev, addresses: data.addresses }));
      setSuccess('Default address updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to set default address');
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    try {
      setError('');
      setUploading(true);
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Image file must be less than 5MB');
        return;
      }
      
      const formData = new FormData();
      formData.append('profileImage', file);

      const token = getToken();
      const fullUrl = `${API_BASE_URL}/api/auth/user/profile-image`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(prev => ({ 
        ...prev, 
        profileImage: data.profileImage 
      }));
      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{animationDelay: '0.15s'}}></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Profile Settings</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Settings size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/30">
                  {user?.profileImage ? (
                    <img 
                      src={`${API_BASE_URL}/${user.profileImage}`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentNode.querySelector('svg').classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <User size={40} className="text-white" />
                  )}
                  <User 
                    size={40} 
                    className={`text-white ${user?.profileImage ? 'hidden' : ''}`} 
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-white text-slate-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-lg group-hover:scale-110 transform">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        uploadProfileImage(e.target.files[0]);
                      }
                    }}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
                <p className="text-blue-100 mb-2">{user?.email}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30">
                    {user?.role}
                  </span>
                  <span className="bg-green-500/20 backdrop-blur-sm text-green-100 text-sm px-3 py-1 rounded-full border border-green-300/30 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'addresses'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                Addresses
              </div>
            </button>
          </div>
        </div>

        {/* Alert Messages */}
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                  <p className="text-slate-600 mt-1">Update your personal information</p>
                </div>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${editMode 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {editMode ? <X size={16} /> : <Edit3 size={16} />}
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                      <p className="text-slate-900 font-medium">{user?.name || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Mobile Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={profileForm.mobile}
                      onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your mobile number"
                    />
                  ) : (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                      <p className="text-slate-900 font-medium">{user?.mobile || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Email Address</label>
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    <p className="text-slate-900 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Role</label>
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    <p className="text-slate-900 font-medium capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={updateProfile}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Password & Security</h3>
                  <p className="text-slate-600 mt-1">Manage your account security</p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  <Shield size={16} />
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordForm && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Current Password</label>
                    <div className="relative">
                      <input
                        type={passwordForm.showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm({...passwordForm, showCurrentPassword: !passwordForm.showCurrentPassword})}
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                      >
                        {passwordForm.showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">New Password</label>
                    <div className="relative">
                      <input
                        type={passwordForm.showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm pr-12"
                        placeholder="Enter new password (min 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm({...passwordForm, showNewPassword: !passwordForm.showNewPassword})}
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                      >
                        {passwordForm.showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={passwordForm.showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm pr-12"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm({...passwordForm, showConfirmPassword: !passwordForm.showConfirmPassword})}
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                      >
                        {passwordForm.showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={changePassword}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
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
        )}
      </div>
    </div>
    </div>
  );
};

export default UserProfile;