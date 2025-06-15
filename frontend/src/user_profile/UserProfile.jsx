import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Lock, MapPin, Camera, Save, Edit2, Plus, Trash2, Navigation } from 'lucide-react';
import Navbar from '../common/navbar/Navbar';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    mobile: '+94 77 123 4567',
    email: 'john.doe@email.com',
    profileImage: null
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      address: 'No. 45, Galle Road, Midigama',
      lat: 5.9722,
      lng: 80.3283,
      isDefault: true
    }
  ]);

  const [isEditing, setIsEditing] = useState({
    name: false,
    mobile: false,
    password: false
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    lat: null,
    lng: null
  });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (showAddAddress && mapRef.current && !mapInstanceRef.current) {
      // Create map centered on Midigama
      const map = window.L?.map(mapRef.current).setView([5.9722, 80.3283], 13);
      
      // Add OpenStreetMap tiles
      window.L?.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add click handler for map
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        
        // Clear existing markers
        map.eachLayer((layer) => {
          if (layer instanceof window.L.Marker) {
            map.removeLayer(layer);
          }
        });
        
        // Add new marker
        const marker = window.L?.marker([lat, lng]).addTo(map);
        
        // Reverse geocoding (simplified)
        setNewAddress(prev => ({
          ...prev,
          lat,
          lng,
          address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
        }));
      });

      mapInstanceRef.current = map;
    }

    // Load Leaflet if not already loaded
    if (!window.L && showAddAddress) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
      script.onload = () => {
        // Map will be initialized in the next useEffect run
      };
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showAddAddress]);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleSave = (field, value) => {
    setProfile({ ...profile, [field]: value });
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            
            // Clear existing markers
            mapInstanceRef.current.eachLayer((layer) => {
              if (layer instanceof window.L.Marker) {
                mapInstanceRef.current.removeLayer(layer);
              }
            });
            
            // Add current location marker
            const marker = window.L?.marker([latitude, longitude])
              .addTo(mapInstanceRef.current)
              .bindPopup('Your Current Location')
              .openPopup();
            
            setSelectedLocation({ lat: latitude, lng: longitude });
            setNewAddress(prev => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              address: `Current Location - Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
            }));
          }
        },
        (error) => {
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    }
  };

  const addAddress = () => {
    if (newAddress.label && selectedLocation) {
      const newAddr = {
        id: Date.now(),
        label: newAddress.label,
        address: newAddress.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddr]);
      setNewAddress({ label: '', address: '', lat: null, lng: null });
      setSelectedLocation(null);
      setShowAddAddress(false);
    }
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="nav bar">
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">DIRTYCLOTHS</h1>
          <p className="text-gray-600">Midigama • Premium Laundry Service</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* Profile Info */}
              <div className="text-white">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-blue-100">{profile.email}</p>
                <p className="text-blue-100">{profile.mobile}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h3>
            
            {/* Name */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    {isEditing.name ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">{profile.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isEditing.name ? (
                    <button
                      onClick={() => handleSave('name', profile.name)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit('name')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                    {isEditing.mobile ? (
                      <input
                        type="tel"
                        value={profile.mobile}
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">{profile.mobile}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isEditing.mobile ? (
                    <button
                      onClick={() => handleSave('mobile', profile.mobile)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit('mobile')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Password</label>
                    <p className="text-gray-800">••••••••</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Addresses */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Delivery Addresses</h3>
              </div>
              <button
                onClick={() => setShowAddAddress(true)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg mb-4 ${
                  address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-800">{address.label}</h4>
                      {address.isDefault && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{address.address}</p>
                    <p className="text-sm text-gray-500">
                      Coordinates: {address.lat.toFixed(4)}, {address.lng.toFixed(4)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddAddress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Add New Address</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Address Label (e.g., Home, Office)"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={getCurrentLocation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Use Current Location</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Click on the map to select a location or use your current location
                  </p>
                </div>

                {/* Map Container */}
                <div
                  ref={mapRef}
                  className="w-full h-96 border border-gray-300 rounded-lg mb-4"
                  style={{ minHeight: '400px' }}
                />

                {selectedLocation && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Selected Location:</p>
                    <p className="font-medium">
                      Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddAddress(false);
                    setSelectedLocation(null);
                    setNewAddress({ label: '', address: '', lat: null, lng: null });
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addAddress}
                  disabled={!newAddress.label || !selectedLocation}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Address
                </button>
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