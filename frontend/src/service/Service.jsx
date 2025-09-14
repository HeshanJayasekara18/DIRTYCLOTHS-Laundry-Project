import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Check, DollarSign, Package, Shirt, Droplet, Settings, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../common/navbar/Navbar';
import Footer from '../home/footer/Footer';
import ServiceSection1 from './service-section1/ServiceSection1';
import ServiceSection2 from './service-section2/ServiceSection2';
import ServiceSection3 from './service-section3/ServiceSection3';
import ServiceSection4 from './service-section4/ServiceSection4';
import { UserModel } from '../reg/UserModel';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function LaundryServicePage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    location: { lat: 6.9271, lng: 79.8612 }, // Default to Colombo, Sri Lanka
    selectedService: '',
    preferredDate: '',
    preferredTime: '',
    weight: '',
    specialInstructions: '',
    addOns: [],
    paymentMethod: 'cash'
  });
  const [formError, setFormError] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = UserModel.getSession();
    console.log('Session Data:', session);
    if (session?.email && session?.token) {
      setUser({ email: session.email });
      setFormData((prev) => ({
        ...prev,
        email: session.email
      }));
    } else {
      console.warn('Invalid session data: Missing email or token', session);
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  // Sri Lanka map bounds
  const sriLankaBounds = [
    [5.8, 79.5], // Southwest
    [9.9, 81.9]  // Northeast
  ];

  // Icon mapping for different package types
  const getPackageIcon = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes('full')) return <Package className="text-blue-500" />;
    if (name.includes('wash')) return <Droplet className="text-green-500" />;
    if (name.includes('dry')) return <Shirt className="text-amber-500" />;
    if (name.includes('heavy') || name.includes('custom')) return <Settings className="text-purple-500" />;
    return <Package className="text-blue-500" />;
  };

  // Color mapping for different package types
  const getPackageColor = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes('full')) return "bg-gradient-to-r from-blue-500 to-cyan-400";
    if (name.includes('wash')) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (name.includes('dry')) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    if (name.includes('heavy') || name.includes('custom')) return "bg-gradient-to-r from-purple-500 to-pink-400";
    return "bg-gradient-to-r from-blue-500 to-cyan-400";
  };

  // Helper function to format price with currency
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rs ${price}`;
    }
    return price || 'N/A';
  };

  // Helper function to get starting price
  const getStartingPrice = (pricing) => {
    if (!pricing) return 'Contact for pricing';
    const prices = [];
    if (pricing.below_1) prices.push(pricing.below_1);
    if (pricing.between_1And10) prices.push(pricing.between_1And10);
    if (pricing.above_10) prices.push(pricing.above_10);
    if (prices.length === 0) return 'Contact for pricing';
    const minPrice = Math.min(...prices);
    return `Starting from Rs ${minPrice}(per 100g)`;
  };

  // Helper function to process features
  const processFeatures = (features) => {
    if (Array.isArray(features)) {
      return features;
    }
    if (typeof features === 'string') {
      return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
    }
    return [
      "Professional service",
      "Quality guaranteed",
      "Timely delivery",
      "Affordable pricing"
    ];
  };

  // Helper function to format processing time
  const formatProcessingTime = (packageTime) => {
    if (!packageTime) return "24-48 hours";
    if (typeof packageTime === 'string' && !packageTime.includes('T')) {
      return packageTime;
    }
    try {
      const date = new Date(packageTime);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.warn('Error parsing date:', error);
    }
    return "24-48 hours";
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE;
  // Fetch packages from backend
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const session = UserModel.getSession();
      if (!session?.token) {
        throw new Error('No valid session token');
      }
      const response = await fetch('http://localhost:5000/api/package' || "${API_BASE_URL}/api/package", {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          UserModel.clearSession();
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const transformedPackages = data.map((pkg, index) => {
        const processedFeatures = processFeatures(pkg.features);
        const pricing = pkg.pricing || {};
        return {
          id: pkg.packageID || pkg._id || index + 1,
          packageID: pkg.packageID || pkg._id || index + 1,
          name: pkg.package_name,
          description: pkg.package_description,
          price: getStartingPrice(pricing),
          features: processedFeatures,
          icon: getPackageIcon(pkg.package_name),
          weightPricing: [
            pricing.below_1 && { weight: "Below 1kg", price: formatPrice(pricing.below_1) },
            pricing.between_1And10 && { weight: "1kg - 10kg", price: formatPrice(pricing.between_1And10) },
            pricing.above_10 && { weight: "Above 10kg", price: formatPrice(pricing.above_10) }
          ].filter(Boolean),
          color: getPackageColor(pkg.package_name),
          processingTime: formatProcessingTime(pkg.package_time),
          rating: "4.8/5",
          ordersToday: Math.floor(Math.random() * 100) + 20,
          specialOffer: "Special Offer",
          popularChoice: "customers",
          testimonial: {
            initials: "CU",
            name: "Customer",
            customerSince: "2024",
            review: "Great service with excellent results!"
          },
          addOn: "Premium Care (+Rs 50)",
          timeSavingTip: "Book in advance for better scheduling."
        };
      });
      setPackages(transformedPackages);
      setError(null);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Function to handle navigation to order form
  const handleOrderNow = (service) => {
    setSelectedService(service);
    setFormData({ ...formData, selectedService: service.name });
    setTimeout(() => {
      const detailsSection = document.getElementById('service-details');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle add-ons checkbox
  const handleAddOnChange = (addOn) => {
    setFormData((prev) => {
      const addOns = prev.addOns.includes(addOn)
        ? prev.addOns.filter((item) => item !== addOn)
        : [...prev.addOns, addOn];
      return { ...prev, addOns };
    });
  };

  // Function to handle map click
  const handleMapClick = (latlng) => {
    if (
      latlng.lat >= sriLankaBounds[0][0] &&
      latlng.lat <= sriLankaBounds[1][0] &&
      latlng.lng >= sriLankaBounds[0][1] &&
      latlng.lng <= sriLankaBounds[1][1]
    ) {
      setFormData((prev) => ({
        ...prev,
        location: { lat: latlng.lat, lng: latlng.lng }
      }));
      setGeolocationError(null);
    } else {
      setGeolocationError('Please select a location within Sri Lanka.');
    }
  };

  // Component to handle map click events
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      }
    });
    return null;
  }

  // Component to set map bounds
  function MapBounds() {
    const map = useMap();
    useEffect(() => {
      map.setMaxBounds(sriLankaBounds);
      map.fitBounds(sriLankaBounds);
      // Prevent zooming out too far
      map.setMinZoom(7);
    }, [map]);
    return null;
  }

  // Function to get current location
  const handleGetCurrentLocation = () => {
    setGeolocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (
            latitude >= sriLankaBounds[0][0] &&
            latitude <= sriLankaBounds[1][0] &&
            longitude >= sriLankaBounds[0][1] &&
            longitude <= sriLankaBounds[1][1]
          ) {
            setFormData((prev) => ({
              ...prev,
              location: { lat: latitude, lng: longitude }
            }));
            // Center map on user's location
            const map = document.querySelector('.leaflet-container')?.__leaflet_map__;
            if (map) {
              map.setView([latitude, longitude], 13);
            }
          } else {
            setGeolocationError('Your current location is outside Sri Lanka. Please select a location within Sri Lanka.');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeolocationError('Unable to access your location. Please allow location access or select manually on the map.');
        }
      );
    } else {
      setGeolocationError('Geolocation is not supported by your browser.');
    }
  };

  // Function to calculate total amount
  const calculateTotalAmount = () => {
    let total = 0;
    const weight = parseFloat(formData.weight) || 0;
    if (selectedService && selectedService.weightPricing) {
      const pricing = selectedService.weightPricing.find((p) => {
        if (p.weight === "Below 1kg" && weight <= 1) return true;
        if (p.weight === "1kg - 10kg" && weight > 1 && weight <= 10) return true;
        if (p.weight === "Above 10kg" && weight > 10) return true;
        return false;
      });
      if (pricing) {
        const priceMatch = pricing.price.match(/Rs (\d+)/);
        if (priceMatch) total = parseFloat(priceMatch[1]) * weight;
      }
    }
    if (formData.addOns.includes('Premium Care')) total += 50;
    if (formData.addOns.includes('Fragrance')) total += 300 * weight;
    return total;
  };

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Require login
    const session = UserModel.getSession();
    if (!user || !session?.token) {
      setFormError('Please log in to submit an order.');
      navigate('/login');
      return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'selectedService', 'preferredDate', 'weight', 'location.lat', 'location.lng'];
    const missingFields = requiredFields.filter(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return !formData[parent] || formData[parent][child] === undefined;
      }
      return !formData[field];
    });

    if (missingFields.includes('email')) {
      setFormError('Please provide a valid email address.');
      return;
    } else if (missingFields.length > 0) {
      setFormError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setFormError('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate weight
    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight <= 0) {
      setFormError('Please enter a valid weight');
      return;
    }

    // Validate location within Sri Lanka
    if (
      formData.location.lat < sriLankaBounds[0][0] ||
      formData.location.lat > sriLankaBounds[1][0] ||
      formData.location.lng < sriLankaBounds[0][1] ||
      formData.location.lng > sriLankaBounds[1][1]
    ) {
      setFormError('Selected location is outside Sri Lanka.');
      return;
    }

    try {
      const orderData = {
        orderID: `ORD-${Date.now()}`,
        ...formData,
        serviceDetails: selectedService,
        totalAmount: calculateTotalAmount(),
        addOnDetails: formData.addOns.map((addOn) => ({
          name: addOn,
          price: addOn === 'Premium Care' ? 50 : 300 * weight
        })),
        userEmail: user.email
      };

      const trySubmitOrder = async (token) => {
        const response = await fetch('http://localhost:5000/api/order' || "${API_BASE_URL}/api/order", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });
        return response;
      };

      let response = await trySubmitOrder(session.token);

      // Handle 401 error by attempting to refresh token
      if (response.status === 401) {
        console.warn('401 Unauthorized, attempting to refresh token');
        const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh' || `${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email })
        });

        if (!refreshResponse.ok) {
          setFormError('Session expired. Please log in again.');
          UserModel.clearSession();
          navigate('/login');
          return;
        }

        const refreshData = await refreshResponse.json();
        const newToken = refreshData.token;
        if (newToken) {
          const updatedSession = { ...session, token: newToken };
          UserModel.setSession(updatedSession);
          response = await trySubmitOrder(newToken);
        } else {
          setFormError('Failed to refresh session. Please log in again.');
          UserModel.clearSession();
          navigate('/login');
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to submit order');
      }

      setShowPopup(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        location: { lat: 6.9271, lng: 79.8612 },
        selectedService: '',
        preferredDate: '',
        preferredTime: '',
        weight: '',
        specialInstructions: '',
        addOns: [],
        paymentMethod: 'cash'
      });
      alert('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      setFormError(error.message || 'Failed to submit order. Please try again.');
    }
  };

  // Function to handle "Book Now" button
  const handlebookServices = (packageData) => {
    const session = UserModel.getSession();
    if (!user || !session?.token) {
      setFormError('Please log in to book a service.');
      navigate('/login');
      return;
    }
    if (!packageData) {
      navigate('/laundry-book');
      return;
    }
    setSelectedService(packageData);
    setFormData({ ...formData, selectedService: packageData.name });
    setShowPopup(true);
  };

  // Function to handle "Book Now" in hero section
  const handleBookNow = () => {
    const session = UserModel.getSession();
    if (!user || !session?.token) {
      setFormError('Please log in to book a service.');
      navigate('/login');
      return;
    }
    navigate('/laundry-book');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <ServiceSection1 />
      <ServiceSection2 onOrderNow={handleOrderNow} />
      
      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Book {selectedService?.name}</h2>
              <button 
                onClick={() => setShowPopup(false)} 
                className="text-gray-500 h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {formError && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-red-700 text-sm font-medium">{formError}</p>
              </div>
            )}

            {geolocationError && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
                <p className="text-yellow-700 text-sm font-medium">{geolocationError}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-100"
                  required
                  disabled={!!user}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  placeholder="Enter your 10-digit phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Location on Map <span className="text-red-500">*</span></label>
                <div className="h-80 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <MapContainer
                    center={[formData.location.lat, formData.location.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    maxBounds={sriLankaBounds}
                    maxBoundsViscosity={1.0}
                    className="leaflet-container"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[formData.location.lat, formData.location.lng]} />
                    <MapClickHandler />
                    <MapBounds />
                  </MapContainer>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">
                    Selected: Lat {formData.location.lat.toFixed(4)}, Lng {formData.location.lng.toFixed(4)}
                  </p>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Use Current Location</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select a time</option>
                  <option value="Morning">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon">Afternoon (12 PM - 3 PM)</option>
                  <option value="Evening">Evening (3 PM - 6 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Average Weight of Laundry (kg) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  min="0"
                  step="0.1"
                  placeholder="Enter weight in kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Add-Ons</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.addOns.includes('Premium Care')}
                      onChange={() => handleAddOnChange('Premium Care')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Premium Care (+Rs 50)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.addOns.includes('Fragrance')}
                      onChange={() => handleAddOnChange('Fragrance')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Fragrance (+Rs 300 per kg)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="4"
                  placeholder="Any special instructions for your order?"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-lg font-semibold text-gray-800">Estimated Total: Rs {calculateTotalAmount()}</p>
                <p className="text-sm text-gray-600 mt-1">This is an estimate based on the provided weight and selected add-ons. Actual price may vary based on final weight.</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Details Section */}
      {selectedService && (
        <div id="service-details" className="container mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${selectedService?.color?.replace('bg-gradient-to-r', 'bg') || 'bg-blue-500'}`}>
                {selectedService?.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedService.name} Details</h2>
            </div>
            <button 
              onClick={() => setSelectedService(null)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className={`${selectedService?.color || 'bg-blue-500'} h-2`}></div>
            
            {/* Service Overview */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {selectedService?.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedService?.name}</h3>
                  <p className="text-gray-600">{selectedService?.description}</p>
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                    Most popular choice for {selectedService?.popularChoice}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Service Details Tabs */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row border-b border-gray-200 mb-6">
                <div className="md:w-1/2 mb-6 lg:mb-0 lg:pr-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Premium Features</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-start bg-white p-3 rounded-lg border border-gray-100 hover:shadow-md transition">
                        <div className="mt-1 mr-3 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check size={14} className="text-green-600" />
                        </div>
                        <div>
                          <span className="text-gray-800 font-medium">{feature}</span>
                          <p className="text-gray-500 text-sm mt-1">
                            {index === 0 ? "We use top quality products for superior results." :
                             index === 1 ? "Our experts ensure every detail is perfect." :
                             index === 2 ? "Your clothes are handled with the utmost care." :
                             "We prioritize efficiency without compromising quality."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-100">
                    <div className="flex items-start">
                      <div className="mr-3 text-blue-500">
                        <Star size={20} fill="currentColor" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Most Popular Add-On</h4>
                        <p className="text-blue-600 text-sm mt-1">{selectedService.addOn}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 lg:border-l lg:pl-6 border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <DollarSign size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Transparent Pricing</h3>
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-5">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800">Weight-Based Pricing</h4>
                      <span className="text-sm text-gray-500">Updated May 2025</span>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedService.weightPricing.map((pricing, index) => (
                        <div key={index} className={`flex justify-between p-3 rounded-lg ${index === 1 ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-100'}`}>
                          <div className="flex items-center">
                            <div className={`w-2 h-6 rounded-sm mr-3 ${
                              index === 0 ? 'bg-red-400' : 
                              index === 1 ? 'bg-green-400' : 'bg-yellow-400'
                            }`}></div>
                            <span className={`font-medium ${index === 1 ? 'text-green-800' : 'text-gray-800'}`}>
                              {pricing.weight}
                            </span>
                          </div>
                          <span className={`font-bold text-lg ${index === 1 ? 'text-green-600' : 'text-gray-800'}`}>{pricing.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-5 p-3 bg-gray-100 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Additional Options</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Check size={14} className="text-green-500 mr-1" />
                          <span>Delivery (Free)</span>
                        </div>
                        <div className="flex items-center">
                          <Check size={14} className="text-green-500 mr-1" />
                          <span>Fragrance (+Rs 300 per 1kg)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial for this service */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold text-blue-600">{selectedService?.testimonial?.initials}</span>
                  </div>
                  <div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="#FFDD00" color="#FFDD00" />
                      ))}
                      <span className="ml-2 text-gray-500 text-sm">Verified Customer</span>
                    </div>
                    <p className="text-gray-700 italic mb-2">"{selectedService?.testimonial?.review}"</p>
                    <p className="text-sm text-gray-500">
                      {selectedService?.testimonial?.name} - Customer since {selectedService?.testimonial?.customerSince}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-6">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="mb-3 sm:mb-0 w-full sm:w-auto border border-gray-300 text-gray-600 hover:bg-gray-50 py-3 px-5 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                >
                  <ChevronRight size={18} className="mr-1 rotate-180" />
                  Back to All Services
                </button>
                
                <div className="flex w-full sm:w-auto">
                  <button
                    onClick={() => handlebookServices(selectedService)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Our Services */}
      <ServiceSection3 />

      {/* What Our Customers Say */}
      <ServiceSection4 />

      {/* Call to Action */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Premium Laundry Service?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who trust us with their laundry needs. First-time customers get 15% off!</p>
          <button 
            onClick={handleBookNow}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition duration-300 inline-flex items-center"
          >
            Book Your Service Now <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}