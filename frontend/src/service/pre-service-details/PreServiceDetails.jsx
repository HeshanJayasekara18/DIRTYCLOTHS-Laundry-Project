import { useNavigate } from "react-router-dom";
import { Package, Droplet, Shirt, Settings, ChevronRight, Check } from "lucide-react";
import Navbar from "../../common/navbar/Navbar";
import Footer from "../../home/footer/Footer";

// Dummy package data (replace with API call if needed)
const demoPackages = [
  {
    id: 1,
    name: "Full Service",
    description: "Complete wash, dry, and fold for all your laundry.",
    features: [
      "Professional cleaning",
      "Free pickup & delivery",
      "Eco-friendly detergents",
      "Express options available"
    ],
    price: "Starting from Rs 300",
    icon: <Package className="text-blue-500" />,
    color: "bg-gradient-to-r from-blue-500 to-cyan-400",
    testimonial: {
      initials: "CU",
      name: "Customer",
      customerSince: "2024",
      review: "Great service with excellent results!"
    },
    addOn: "Premium Care (+Rs 50)"
  },
  {
    id: 2,
    name: "Wash Only",
    description: "Quick and affordable washing for everyday clothes.",
    features: [
      "Gentle wash cycles",
      "Affordable pricing",
      "Fast turnaround",
      "Quality guaranteed"
    ],
    price: "Starting from Rs 200",
    icon: <Droplet className="text-green-500" />,
    color: "bg-gradient-to-r from-green-500 to-emerald-400",
    testimonial: {
      initials: "AN",
      name: "Another User",
      customerSince: "2023",
      review: "Very convenient and reliable!"
    },
    addOn: "Fragrance (+Rs 300 per kg)"
  },
  {
    id: 3,
    name: "Dry Clean",
    description: "Perfect for delicate and formal wear.",
    features: [
      "Expert stain removal",
      "Gentle on fabrics",
      "Premium solvents",
      "On-time delivery"
    ],
    price: "Starting from Rs 500",
    icon: <Shirt className="text-amber-500" />,
    color: "bg-gradient-to-r from-amber-500 to-yellow-400",
    testimonial: {
      initials: "DR",
      name: "Dry Clean Fan",
      customerSince: "2022",
      review: "My suits have never looked better!"
    },
    addOn: "Premium Hanger (+Rs 100)"
  },
  {
    id: 4,
    name: "Heavy Package",
    description: "Ideal for large items like blankets, curtains, and rugs.",
    features: [
      "Specialized heavy-duty wash",
      "Extra-large machines",
      "Stain treatment",
      "Careful drying and folding"
    ],
    price: "Starting from Rs 800",
    icon: <Settings className="text-purple-500" />,
    color: "bg-gradient-to-r from-purple-500 to-pink-400",
    testimonial: {
      initials: "HP",
      name: "Heavy User",
      customerSince: "2021",
      review: "Perfect for my big laundry needs!"
    },
    addOn: "Extra Rinse (+Rs 100)"
  }
];

export default function PreServiceDetails() {
  const navigate = useNavigate();

  // If you want to fetch real packages, use useEffect and fetch here

  // Handle "Order Now" click
  const handleOrderNow = () => {
    navigate("/login", { state: { from: "/services" } });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Our Laundry Packages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className={`${pkg.color} h-2`} />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-100">
                    {pkg.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{pkg.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <ul className="mb-4 space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check size={16} className="text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pkg.price}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                    {pkg.addOn}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center mb-1">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 font-bold text-blue-600">
                      {pkg.testimonial.initials}
                    </span>
                    <span className="text-gray-700 text-sm">{pkg.testimonial.name}</span>
                  </div>
                  <p className="text-gray-600 italic text-sm">"{pkg.testimonial.review}"</p>
                </div>
                <button
                  onClick={handleOrderNow}
                  className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center transition duration-300"
                >
                  Order Now <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Want to book a service?{" "}
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={handleOrderNow}
            >
              Login or Register
            </span>{" "}
            to continue.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}