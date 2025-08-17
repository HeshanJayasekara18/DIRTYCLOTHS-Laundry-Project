import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  Star, 
  Users, 
  CheckCircle, 
  User, 
  Phone, 
  Calendar, 
  MapPin 
} from 'lucide-react';

const LaundryOrderForm = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pickupTime: '',
    location: '',
    specialInstructions: '',
    weight: '',
    addOns: []
  });
  const [errors, setErrors] = useState({});

  // Initialize with default package data
  useEffect(() => {
    const defaultPackage = {
      id: 'full-package',
      name: 'Full Package',
      description: 'Complete washing, drying, and folding service',
      icon: Package,
      color: 'blue',
      basePrice: 60,
      processingTime: '24-48 hours',
      rating: 4.9,
      ordersToday: 124,
      specialOffer: '10% Off',
      features: [
        'Premium detergents included',
        'Stain treatment at no extra cost',
        'Neatly folded and packaged',
        '24-48 hour turnaround',
        'Quality guarantee',
        'Eco-friendly options available'
      ],
      pricing: [
        { range: 'Below 1kg', price: 100, popular: false },
        { range: '1kg - 10kg', price: 80, popular: true },
        { range: 'Above 10kg', price: 60, popular: false }
      ],
      addOns: [
        { name: 'Express Service', price: 10 },
        { name: 'Delivery', price: 7 },
        { name: 'Eco-friendly', price: 5 },
        { name: 'Fragrance', price: 3 }
      ]
    };
    
    setSelectedPackage(defaultPackage);
    setFormData(prev => ({ ...prev, weight: '1kg - 10kg' }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddOnToggle = (addOn) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOn)
        ? prev.addOns.filter(item => item !== addOn)
        : [...prev.addOns, addOn]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    const selectedPricing = selectedPackage.pricing.find(p => p.range === formData.weight);
    const basePrice = selectedPricing ? selectedPricing.price : selectedPackage.basePrice;
    const addOnTotal = formData.addOns.reduce((total, addOn) => {
      const addOnItem = selectedPackage.addOns.find(item => item.name === addOn);
      return total + (addOnItem ? addOnItem.price : 0);
    }, 0);
    
    return basePrice + addOnTotal;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const orderData = {
        ...formData,
        package: selectedPackage,
        total: calculateTotal(),
        orderTime: new Date().toISOString()
      };
      console.log('Order submitted:', orderData);
      alert('Order placed successfully! 🎉\n\nOrder Details:\n' + 
            `Service: ${selectedPackage.name}\n` +
            `Weight: ${formData.weight}\n` +
            `Total: Rs ${calculateTotal()}\n` +
            `Customer: ${formData.name}\n` +
            `Mobile: ${formData.mobile}`);
    }
  };

  const handleBackClick = () => {
    // In a real app, this would use navigate('/services')
    alert('In your app, this would navigate back to the services page');
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading package details...</p>
        </div>
      </div>
    );
  }

  const IconComponent = selectedPackage.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Services
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Review your selected package and provide pickup details</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Package Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-50 rounded-xl mr-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPackage.name}</h2>
                  <p className="text-gray-600">{selectedPackage.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{selectedPackage.processingTime}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{selectedPackage.rating}/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{selectedPackage.ordersToday} orders today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-600 font-medium">{selectedPackage.specialOffer}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Features</h3>
              <div className="space-y-3">
                {selectedPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight-Based Pricing</h3>
              <div className="space-y-2">
                {selectedPackage.pricing.map((pricing, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                    pricing.popular ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}>
                    <span className="text-gray-700">
                      {pricing.range}
                      {pricing.popular && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">POPULAR</span>}
                    </span>
                    <span className="font-semibold text-gray-900">Rs {pricing.price} (per 100g)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Pickup Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Pickup Location *
                </label>
                <textarea
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your complete address with landmarks"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              {/* Weight Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Weight</label>
                <select
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {selectedPackage.pricing.map((pricing, index) => (
                    <option key={index} value={pricing.range}>
                      {pricing.range} - Rs {pricing.price} (per 100g)
                    </option>
                  ))}
                </select>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Additional Services</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedPackage.addOns.map((addOn, index) => (
                    <label key={index} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.addOns.includes(addOn.name)}
                        onChange={() => handleAddOnToggle(addOn.name)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{addOn.name}</div>
                        <div className="text-sm text-gray-500">+Rs {addOn.price}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Any special care instructions for your laundry..."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price ({formData.weight})</span>
                    <span>Rs {selectedPackage.pricing.find(p => p.range === formData.weight)?.price || selectedPackage.basePrice}</span>
                  </div>
                  {formData.addOns.map((addOnName, index) => {
                    const addOn = selectedPackage.addOns.find(item => item.name === addOnName);
                    return (
                      <div key={index} className="flex justify-between">
                        <span>{addOnName}</span>
                        <span>Rs {addOn?.price}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">Rs {calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
              >
                Place Order - Rs {calculateTotal()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryOrderForm;