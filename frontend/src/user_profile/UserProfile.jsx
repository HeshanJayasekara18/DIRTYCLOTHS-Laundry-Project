import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  Lock,
  MapPin,
  Camera,
  Save,
  Edit2,
  Plus,
  Trash2,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserModel } from "./../reg/UserModel";
import Navbar from "../common/navbar/Navbar";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    profileImage: null,
  });
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState({
    name: false,
    mobile: false,
    password: false,
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    lat: null,
    lng: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Phone number validation (Sri Lankan format: +94xxxxxxxxx or 07xxxxxxxx)
  const validatePhoneNumber = (mobile) => {
    const phoneRegex = /^(?:\+94\d{9}|07\d{8})$/;
    return phoneRegex.test(mobile);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const session = UserModel.getSession();
      if (!session || !session.token) {
        console.log("No session token, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
        const userData = response.data;
        setProfile({
          name: userData.name || "Unknown User",
          mobile: userData.mobile || "",
          email: userData.email || "",
          profileImage: userData.profileImage || null,
        });

        const validAddresses = (userData.addresses || []).map((addr) => ({
          ...addr,
          _id: addr._id || Date.now().toString(),
          lat: addr.lat || 0,
          lng: addr.lng || 0,
          isDefault: addr.isDefault || false,
        }));
        setAddresses(validAddresses);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          UserModel.clearSession();
          navigate("/login");
        } else {
          setErrorMessage(
            error.response?.data?.message || "Failed to fetch user data"
          );
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Map initialization
  useEffect(() => {
    if (showAddAddress && mapRef.current && !mapInstanceRef.current) {
      const loadLeaflet = async () => {
        try {
          if (!window.L) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
            document.head.appendChild(link);

            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js";
              script.onload = () => {
                setIsMapLoaded(true);
                resolve();
              };
              script.onerror = () => {
                setErrorMessage("Failed to load map library");
                reject();
              };
              document.head.appendChild(script);
            });
          } else {
            setIsMapLoaded(true);
          }
          initializeMap();
        } catch (error) {
          console.error("Leaflet loading error:", error);
          setErrorMessage("Failed to initialize map");
        }
      };

      loadLeaflet();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [showAddAddress]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) {
      setErrorMessage("Map initialization failed");
      return;
    }

    const map = window.L.map(mapRef.current).setView([6.9271, 79.8612], 13); // Default to Colombo, Sri Lanka
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      map.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          map.removeLayer(layer);
        }
      });
      window.L.marker([lat, lng]).addTo(map);
      setNewAddress((prev) => ({
        ...prev,
        lat,
        lng,
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      }));
    });

    mapInstanceRef.current = map;
  };

  // Update profile
  const handleSave = async (field, value) => {
    if (field === "mobile" && value && !validatePhoneNumber(value)) {
      setErrorMessage("Invalid phone number format. Use +94xxxxxxxxx or 07xxxxxxxx");
      return;
    }

    try {
      const session = UserModel.getSession();
      const response = await axios.put(
        "http://localhost:5000/api/auth/user",
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log("Updated profile:", response.data);
      setProfile({ ...profile, [field]: value });
      setIsEditing({ ...isEditing, [field]: false });

      const updatedSession = {
        ...session,
        name: response.data.name,
        email: response.data.email,
        mobile: response.data.mobile,
        profileImage: response.data.profileImage,
        addresses: response.data.addresses,
      };
      UserModel.setSession(updatedSession);
      setErrorMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.response?.data?.message || `Failed to update ${field}`);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select an image file");
        return;
      }
      const session = UserModel.getSession();
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/user/profile-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const newImageUrl = response.data.profileImage;
        setProfile((prev) => ({
          ...prev,
          profileImage: newImageUrl,
        }));
        const updatedSession = { ...session, profileImage: newImageUrl };
        UserModel.setSession(updatedSession);
        setErrorMessage("Profile image updated successfully!");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to upload profile image"
        );
        console.error("Image upload error:", error);
      }
    }
  };

  // Add address
  const addAddress = async () => {
    if (!newAddress.label) {
      setErrorMessage("Address label is required");
      return;
    }
    if (!selectedLocation) {
      setErrorMessage("Please select a location on the map");
      return;
    }

    let formattedAddress = `Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}`;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`,
        {
          headers: {
            'User-Agent': 'DirtyClothsApp/1.0 (contact: your-email@example.com)'
          }
        }
      );
      if (response.data && response.data.display_name) {
        formattedAddress = response.data.display_name;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }

    const newAddr = {
      _id: Date.now().toString(),
      label: newAddress.label,
      address: formattedAddress,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      isDefault: addresses.length === 0,
    };

    try {
      const session = UserModel.getSession();
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/addresses",
        newAddr,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      setAddresses([...addresses, { ...response.data.address, _id: response.data.address._id }]);
      setNewAddress({ label: "", address: "", lat: null, lng: null });
      setSelectedLocation(null);
      setShowAddAddress(false);
      setErrorMessage("Address added successfully");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to add address");
    }
  };

  // Delete address
  const deleteAddress = async (id) => {
    try {
      const session = UserModel.getSession();
      await axios.delete(`http://localhost:5000/api/auth/user/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      setAddresses(addresses.filter((addr) => addr._id !== id));
      setErrorMessage("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete address");
    }
  };

  // Set default address
  const setDefaultAddress = async (id) => {
    try {
      const session = UserModel.getSession();
      await axios.put(
        `http://localhost:5000/api/auth/user/addresses/${id}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === id,
        }))
      );
      setErrorMessage("Default address set successfully");
    } catch (error) {
      console.error("Error setting default address:", error);
      setErrorMessage(error.response?.data?.message || "Failed to set default address");
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            mapInstanceRef.current.eachLayer((layer) => {
              if (layer instanceof window.L.Marker) {
                mapInstanceRef.current.removeLayer(layer);
              }
            });
            const marker = window.L.marker([latitude, longitude])
              .addTo(mapInstanceRef.current)
              .bindPopup("Your Current Location")
              .openPopup();
            setSelectedLocation({ lat: latitude, lng: longitude });
            setNewAddress((prev) => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              address: `Current Location - Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
            }));
            setErrorMessage("Current location set successfully");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setErrorMessage("Unable to get your location. Please select a location on the map.");
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword) {
      setErrorMessage("Current password is required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long");
      return;
    }
    try {
      const session = UserModel.getSession();
      await axios.put(
        "http://localhost:5000/api/auth/user/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrorMessage("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="nav-bar">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {errorMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                errorMessage.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">DIRTYCLOTHS</h1>
            <p className="text-gray-600">Midigama • Premium Laundry Service</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white p-1">
                    {profile.profileImage ? (
                      <img
                        src={
                          profile.profileImage
                            ? `${profile.profileImage}?t=${new Date().getTime()}`
                            : "/default-profile.png"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", profile.profileImage);
                          e.target.src = "/default-profile.png";
                        }}
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
                    aria-label="Upload profile picture"
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
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-blue-100">{profile.email}</p>
                  <p className="text-blue-100">{profile.mobile || "No mobile number set"}</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h3>
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
                          aria-label="Edit full name"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing.name ? (
                      <button
                        onClick={() => handleSave("name", profile.name)}
                        className="text-green-600 hover:text-green-700"
                        aria-label="Save name"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing({ ...isEditing, name: true })}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Edit name"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
                          placeholder="+94xxxxxxxxx or 07xxxxxxxx"
                          className="block w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Edit mobile number"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.mobile || "No mobile number set"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing.mobile ? (
                      <button
                        onClick={() => handleSave("mobile", profile.mobile)}
                        className="text-green-600 hover:text-green-700"
                        aria-label="Save mobile number"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing({ ...isEditing, mobile: true })}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Edit mobile number"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
                    aria-label="Edit password"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                  aria-label="Add new address"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>
            </div>
            <div className="p-8">
              {Array.isArray(addresses) && addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No addresses added yet. Add your first address to get started!</p>
                </div>
              ) : (
                (addresses || [])
                  .filter((addr) => addr && addr.label && addr.address)
                  .map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border rounded-lg mb-4 ${
                        address.isDefault ? "border-green-500 bg-green-50" : "border-gray-200"
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
                          <p className="text-gray-600 text-sm">
                            Lat: {address.lat.toFixed(6)}, Lng: {address.lng.toFixed(6)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address._id)}
                              className="text-green-600 hover:text-green-700 text-sm"
                              aria-label={`Set ${address.label} as default address`}
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => !address.isDefault && deleteAddress(address._id)}
                            className={`text-red-600 hover:text-red-700 ${address.isDefault ? "opacity-50 cursor-not-allowed" : ""}`}
                            aria-label={`Delete ${address.label} address`}
                            disabled={address.isDefault}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
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
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Current password"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="New password"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Confirm new password"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowPasswordChange(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    aria-label="Cancel password change"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label="Update password"
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
                      aria-label="Address label"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={getCurrentLocation}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        aria-label="Use current location"
                        disabled={!isMapLoaded}
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Use Current Location</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Click on the map to select a location or use your current location
                    </p>
                  </div>
                  <div
                    ref={mapRef}
                    className="w-full h-96 border border-gray-300 rounded-lg mb-4"
                    style={{ minHeight: "400px", minWidth: "100%" }}
                  >
                    {!isMapLoaded && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Loading map...</p>
                      </div>
                    )}
                  </div>
                  {selectedLocation && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-600">Selected Location:</p>
                      <p className="font-medium">
                        {newAddress.address}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAddAddress(false);
                      setSelectedLocation(null);
                      setNewAddress({ label: "", address: "", lat: null, lng: null });
                      setErrorMessage("");
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    aria-label="Cancel address addition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAddress}
                    disabled={!newAddress.label || !selectedLocation}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    aria-label="Add address"
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