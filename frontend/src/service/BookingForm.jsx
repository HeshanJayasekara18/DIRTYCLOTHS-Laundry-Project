import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Star, Check, Clock, DollarSign, Package, Shirt, Droplet, Settings, X, User, Phone, Mail, MapPin, Calendar, Weight, CreditCard } from 'lucide-react';

export default function LaundryBookingForm() {
  const location = useLocation();
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.selectedService) {
      setSelectedService(location.state.selectedService);
    }
  }, [location.state]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    preferredDate: '',
    preferredTime: '',
    weight: '',
    specialInstructions: '',
    addOns: [],
    paymentMethod: 'cash'
  });

  const [formErrors, setFormErrors] = useState({});

  // Helper functions to process package data
  const getPackageIcon = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes('full')) return <Package className="text-blue-500" />;
    if (name.includes('wash')) return <Droplet className="text-green-500" />;
    if (name.includes('dry')) return <Shirt className="text-amber-500" />;
    if (name.includes('heavy') || name.includes('custom')) return <Settings className="text-purple-500" />;
    return <Package className="text-blue-500" />;
  };

  const getPackageColor = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes('full')) return "bg-gradient-to-r from-blue-500 to-cyan-400";
    if (name.includes('wash')) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (name.includes('dry')) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    if (name.includes('heavy') || name.includes('custom')) return "bg-gradient-to-r from-purple-500 to-pink-400";
    return "bg-gradient-to-r from-blue-500 to-cyan-400";
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rs ${price}`;
    }
    return price || 'N/A';
  };

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

  // Add-on options
  const addOnOptions = [
    { id: 'express', name: 'Express Service', price: 10, description: '3-hour turnaround' },
    { id: 'eco', name: 'Eco-Friendly', price: 5, description: 'Biodegradable detergents' },
    { id: 'delivery', name: 'Home Delivery', price: 7, description: 'Free pickup & delivery' },
    { id: 'fragrance', name: 'Premium Fragrance', price: 3, description: 'Long-lasting freshness' },
    { id: 'starch', name: 'Light Starch', price: 2, description: 'Professional finish' },
    { id: 'fabric-softener', name: 'Fabric Softener', price: 3, description: 'Extra soft feel' }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle add-on selection
  const handleAddOnChange = (addOnId) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.preferredDate) errors.preferredDate = 'Preferred date is required';
    if (!formData.weight) errors.weight = 'Estimated weight is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedService || !formData.weight) return 0;

    const weight = parseFloat(formData.weight);
    let basePrice = 0;

    const pricing = selectedService.weightPricing?.find(tier => {
      if (tier.weight.includes('Below 1kg') && weight < 1) return true;
      if (tier.weight.includes('1kg - 10kg') && weight >= 1 && weight <= 10) return true;
      if (tier.weight.includes('Above 10kg') && weight > 10) return true;
      if (tier.weight.includes('Above 20kg') && weight > 20) return true;
      return false;
    });

    if (pricing) {
      const priceMatch = pricing.price.match(/Rs (\d+)/);
      if (priceMatch) {
        const pricePerKg = parseInt(priceMatch[1]) * 10;
        basePrice = (weight * pricePerKg) / 100;
      }
    }

    const addOnTotal = formData.addOns.reduce((total, addOnId) => {
      const addOn = addOnOptions.find(option => option.id === addOnId);
      return total + (addOn ? addOn.price : 0);
    }, 0);

    return basePrice + addOnTotal;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bookingData = {
      ...formData,
      selectedService: selectedService.packageID,
      serviceDetails: selectedService,
      totalAmount: calculateTotal(),
      addOnDetails: formData.addOns.map(id => addOnOptions.find(option => option.id === id)),
      bookingDate: new Date().toISOString()
    };

    console.log('Booking submitted:', bookingData);
    alert('Booking submitted successfully! We will contact you shortly.');

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      preferredDate: '',
      preferredTime: '',
      weight: '',
      specialInstructions: '',
      addOns: [],
      paymentMethod: 'cash'
    });
    window.history.back();
    setShowBookingForm(false);
    setSelectedService(null);
  };

  // Handle service selection and show booking form
  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingForm(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Laundry Service Booking</h1>
        </div>
      </div>

      {selectedService ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
            <button
              onClick={() => {
                setSelectedService(null);
                window.history.back();
              }}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User size={20} className="mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your first name"
                      />
                      {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your last name"
                      />
                      {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone size={20} className="mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="+94 77 123 4567"
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin size={20} className="mr-2 text-red-600" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full address"
                      />
                      {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Enter your city"
                        />
                        {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar size={20} className="mr-2 text-purple-600" />
                    Service Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.preferredDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {formErrors.preferredDate && <p className="text-red-500 text-xs mt-1">{formErrors.preferredDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select time slot</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 6PM)</option>
                        <option value="evening">Evening (6PM - 8PM)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Weight (kg) *
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0.1"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.weight ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 2.5"
                      />
                      {formErrors.weight && <p className="text-red-500 text-xs mt-1">{formErrors.weight}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special care instructions for your clothes..."
                    />
                  </div>
                </div>

                {/* Add-ons */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add-on Services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {addOnOptions.map((addOn) => (
                      <label key={addOn.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.addOns.includes(addOn.id)}
                          onChange={() => handleAddOnChange(addOn.id)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{addOn.name}</span>
                            <span className="text-blue-600 font-semibold">+Rs {addOn.price}</span>
                          </div>
                          <p className="text-sm text-gray-500">{addOn.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard size={20} className="mr-2 text-green-600" />
                    Payment Method
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-800">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-800">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-800">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                >
                  <CreditCard size={20} className="mr-2" />
                  Complete Booking - Rs {calculateTotal().toFixed(2)}
                </button>
              </form>
            </div>

            {/* Selected Service Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>

                {/* Selected Service */}
                <div className="mb-6">
                  <div className={`${selectedService?.color} h-1 w-full rounded-full mb-3`}></div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {selectedService?.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedService.name}</h4>
                      <p className="text-sm text-gray-600">{selectedService.processingTime}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{selectedService.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {selectedService?.features?.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check size={14} className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill="#FFDD00" color="#FFDD00" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{selectedService.rating}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    {formData.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{formData.weight} kg</span>
                      </div>
                    )}
                    {formData.preferredDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preferred Date:</span>
                        <span className="font-medium">{formData.preferredDate}</span>
                      </div>
                    )}
                    {formData.preferredTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preferred Time:</span>
                        <span className="font-medium">{formData.preferredTime}</span>
                      </div>
                    )}
                    {formData.addOns.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons:</span>
                        <span className="font-medium">
                          {formData.addOns.map(id => {
                            const addOn = addOnOptions.find(option => option.id === id);
                            return addOn ? addOn.name : '';
                          }).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-blue-600">Rs {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Service Selected</h2>
          <p className="text-gray-600 mb-6">Please select a service package first.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back to Services
          </button>
        </div>
      )}
    </div>
  );
}