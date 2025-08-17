
import { useState, useEffect } from 'react';
import { Package, Shirt, Droplet, Settings } from 'lucide-react';

export default function ServiceSection2({ onOrderNow }) {
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

  // Fetch packages from backend
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/package');
      if (!response.ok) {
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

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
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
          {packages.map((service) => (
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
                  onClick={() => onOrderNow(service)}
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
  );
}
