import { useState, useEffect, useCallback } from 'react';
import { Package, Shirt, Droplet, Settings } from 'lucide-react';
import { API_BASE_URL } from '../../config';

export default function ServiceSection2({ onOrderNow }) {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);

  // Icon mapping
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
    if (Array.isArray(features)) return features;
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
    } catch (err) {
      console.warn('Error parsing date:', err);
    }
    return "24-48 hours";
  };

  // ✅ fetchPackages wrapped in useCallback (fixes missing deps warning)
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/package`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const transformed = data.map((pkg, index) => {
        const processedFeatures = processFeatures(pkg.features);
        const pricing = pkg.pricing || {};
        return {
          id: pkg.packageID || pkg._id || index + 1,
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
        };
      });
      setPackages(transformed);
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again later.');
    } finally {
      // Loading complete
    }
  }, []); // API_BASE_URL is a constant

  // ✅ useEffect now depends on fetchPackages
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Premium Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our range of professional laundry services tailored to meet your specific needs with exceptional quality and care.
        </p>
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
