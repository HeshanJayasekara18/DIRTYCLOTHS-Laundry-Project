import { useCallback, useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  MapPin,  
  Eye, 
  EyeOff,
  Camera,
  ArrowLeft,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../common/navbar/Navbar';
import Addresstab from './Addresstab';
import { API_BASE_URL } from '../config';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const getToken = () => localStorage.getItem('token');

  const checkAuthForAPI = () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };



  // ✅ Memoized API call
  const apiCall = useCallback(async (url, options = {}) => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return null;
    }

    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid response format");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (err) {
      console.error("API call error:", err);
      throw err;
    }
  }, [navigate]); // API_BASE_URL is a constant

  // ✅ Memoized fetchUserProfile
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await apiCall('/api/auth/user');
      if (data) {
        setUser(data);
        setProfileForm({
          name: data.name || '',
          mobile: data.mobile || ''
        });
      }
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, navigate]);


  const updateProfile = async () => {
    if (!checkAuthForAPI()) return;
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
      if (data) {
        setUser(prev => ({ ...prev, ...data }));
        setEditMode(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const changePassword = async () => {
    if (!checkAuthForAPI()) return;

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

  const uploadProfileImage = async (file) => {
    if (!checkAuthForAPI()) return;

    try {
      setError('');
      setUploading(true);

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be less than 5MB');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', file);

      const token = getToken();
      if (!token) return;

      const fullUrl = `${API_BASE_URL}/api/auth/user/profile-image`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const timestamp = Date.now();
      setUser(prev => ({ 
        ...prev, 
        profileImage: data.profileImage + `?t=${timestamp}`
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

  const getProfileImageUrl = () => {
    if (!user?.profileImage) return null;
    if (typeof user.profileImage === "string") {
      const timestamp = Date.now();
      return user.profileImage.startsWith("http")
        ? `${user.profileImage}?t=${timestamp}`
        : `${API_BASE_URL}/${user.profileImage}?t=${timestamp}`;
    }
    if (typeof user.profileImage === "object" && user.profileImage.data) {
      const base64String = btoa(
        new Uint8Array(user.profileImage.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:image/jpeg;base64,${base64String}`;
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fetchUserProfile, navigate]);



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
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
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
                        src={getProfileImageUrl()}
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                        onLoad={(e) => {
                          e.target.nextElementSibling.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <User 
                      size={40} 
                      className={`text-white ${user?.profileImage ? 'hidden' : 'block'}`} 
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

          {activeTab === 'addresses' && (
            <Addresstab 
              user={user}
              setUser={setUser}
              error={error}
              setError={setError}
              success={success}
              setSuccess={setSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;