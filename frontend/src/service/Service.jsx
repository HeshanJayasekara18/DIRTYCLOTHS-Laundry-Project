import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Check, Clock, DollarSign, Package, Shirt, Droplet, Settings, X } from 'lucide-react';
import WashingMachine from '../images/washingmachine.jpg';
import machinecirle from '../images/machinicircle.png';
import Navbar from '../common/navbar/Navbar';
import Footer from '../home/footer/Footer';

import ServiceSection3 from './service-section3/ServiceSection3';
import ServiceSection4 from './service-section4/ServiceSection4';

export default function LaundryServicePage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for different package types
  const getPackageIcon = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes('full')) return <Package className="text-blue-500" />;
    if (name.includes('wash')) return <Droplet className="text-green-500" />;
    if (name.includes('dry')) return <Shirt className="text-amber-500" />;
    if (name.includes('heavy') || name.includes('custom')) return <Settings className="text-purple-500" />;
    return <Package className="text-blue-500" />; // Default icon
  };

  // Color mapping for different package types
  const getPackageColor = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes('full')) return "bg-gradient-to-r from-blue-500 to-cyan-400";
    if (name.includes('wash')) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (name.includes('dry')) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    if (name.includes('heavy') || name.includes('custom')) return "bg-gradient-to-r from-purple-500 to-pink-400";
    return "bg-gradient-to-r from-blue-500 to-cyan-400"; // Default color
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
    
    // Find the lowest price from available pricing tiers
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
    
    // If it's already a formatted string, return as is
    if (typeof packageTime === 'string' && !packageTime.includes('T')) {
      return packageTime;
    }
    
    // Try to parse as date and format
    try {
      const date = new Date(packageTime);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.warn('Error parsing date:', error);
    }
    
    return "24-48 hours"; // Default fallback
  };
  
  // Fetch packages from backend
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/package');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
       
      // Transform backend data to match frontend structure
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

  

  // Use backend packages if available, otherwise use static services
  const services = packages.length > 0 ? packages : fetchPackages;

  // Function to handle navigation to order form
  const handleOrderNow = (service) => {
    setSelectedService(service);
    setTimeout(() => {
      const detailsSection = document.getElementById('service-details');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Function to handle "Book Now" button in hero section
  const handleBookNow = () => {
    navigate('/laundry-book');
  };

  // Fixed handlebookServices function
  const handlebookServices = (packageData) => {
    if (!packageData) {
      navigate('/laundry-book');
      return;
    }

    const packageID = packageData.packageID || packageData.id;
    
    if (!packageID) {
      console.error('Package data is missing packageID:', packageData);
      alert('Error: Package information is missing. Please try again.');
      return;
    }
    
    // Create a clean package object for navigation
    const cleanPackageData = {
      ...packageData,
       // Remove non-serializable icon
      packageID: packageID,
      icon: undefined
    };
    
    navigate(`/laundry-book?packageId=${packageID}`, {
      state: {
        selectedService: cleanPackageData
      }
    });

    sessionStorage.setItem('selectedLaundryService', JSON.stringify(cleanPackageData));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative py-14 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Professional Laundry Services</h2>
            <p className="text-blue-100 text-lg mb-6">Experience premium care for your clothes with our expert washing, drying, and folding services.</p>
            <div className="flex items-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="#FFDD00" color="#FFDD00" />
                ))}
              </div>
              <span className="ml-2 text-white">Trusted by 10,000+ customers</span>
            </div>
            <button 
              onClick={() => handlebookServices(null)} // Pass null for general booking
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-300 flex items-center"
            >
              Book Now <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Package size={100} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Premium Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose from our range of professional laundry services tailored to meet your specific needs with exceptional quality and care.</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPackages}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <div className={`${service.color} h-2`}></div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-lg font-semibold text-gray-800 mb-4">{service.price}</div>
                  
                  <button 
                    onClick={() => handleOrderNow(service)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-300"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                              index === 1 ? 'bg-green-400' : 
                              index === 1 ? 'bg-yellow-400' : 'bg-red-400'
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
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    
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

      {/*What Our Customers Say*/}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

     