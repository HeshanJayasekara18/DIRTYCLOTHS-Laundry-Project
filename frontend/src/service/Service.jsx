import { useState } from 'react';
import { ChevronRight, Star, Check, Clock, DollarSign, Package, Shirt, Droplet, Settings } from 'lucide-react';
import  WashingMachine from '../images/washingmachine.jpg';
import machinecirle from '../images/machinicircle.png';
import Navbar from '../common/navbar/Navbar';
import Footer from '../home/footer/Footer';

export default function LaundryServicePage() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      name: "Full Package",
      description: "Complete washing, drying, and folding service for all your laundry needs",
      price: "Starting from Rs 60(per 100g)",
      features: [
        "Premium detergents included",
        "Stain treatment at no extra cost",
        "Neatly folded and packaged",
        "24-48 hour turnaround"
      ],
      icon: <Package className="text-blue-500" />,
      weightPricing: [
        { weight: "Below 1kg", price: "Rs 100(per 100g)" },
        { weight: "1kg - 10kg", price: "Rs 80 (per 100g)" },
        { weight: "Above 10kg", price: "Rs 60(per 100g)" }
      ],
      color: "bg-gradient-to-r from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      name: "Wash Package",
      description: "Basic washing and drying service for everyday laundry",
      price: "Starting from Rs 40(per 100g)",
      features: [
        "Standard washing procedure",
        "Gentle drying cycle",
        "Basic folding included",
        "48 hour turnaround"
      ],
      icon: <Droplet className="text-green-500" />,
      weightPricing: [
        { weight: "Below 1kg", price: "Rs 60(per 100g)" },
        { weight: "1kg - 10kg", price: "Rs 50(per 100g)" },
        { weight: "Above 10kg", price: "Rs 40(per 100g)" }
      ],
      color: "bg-gradient-to-r from-green-500 to-emerald-400"
    },
    {
      id: 3,
      name: "Dry Package",
      description: "Quick drying service for pre-washed items",
      price: "Starting from Rs 30(per 100g)",
      features: [
        "Multiple drying options",
        "Delicate handling",
        "Simple folding",
        "Same day service available"
      ],
      icon: <Shirt className="text-amber-500" />,
      weightPricing: [
        { weight: "Below 1kg", price: "Rs 50(per 100g)" },
        { weight: "1kg - 10kg", price: "Rs 40(per 100g)" },
        { weight: "Above 10kg", price: "Rs 30(per 100g)" }
      ],
      color: "bg-gradient-to-r from-amber-500 to-yellow-400"
    },
    {
      id: 4,
      name: "Havy Package",
      description: "Tailored service for special garments and specific requirements",
      price: "Starting from Rs 20(per 100g)",
      features: [
        "Personalized care instructions",
        "Premium fabric treatment",
        "Special handling for delicates",
        "Priority service available"
      ],
      icon: <Settings className="text-purple-500" />,
      weightPricing: [
        { weight: "Above 20kg", price: "Rs 20(per 100g)" },
        
      ],
      color: "bg-gradient-to-r from-purple-500 to-pink-400"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-14">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={WashingMachine} 
            alt="Washing machine background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>
        </div>
        
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
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-300 flex items-center">
              Book Now <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              
              
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
                  onClick={() => setSelectedService(service)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-300"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Section */}
      {selectedService && (
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${selectedService.color.replace('bg-gradient-to-r', 'bg')}`}>
              {selectedService.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedService.name} Details</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className={`${selectedService.color} h-2`}></div>
            
            {/* Service Overview */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {selectedService.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedService.name}</h3>
                  <p className="text-gray-600">{selectedService.description}</p>
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                    Most popular choice for {selectedService.name === "Full Package" ? "families" : 
                                            selectedService.name === "Wash Package" ? "regular users" : 
                                            selectedService.name === "Dry Package" ? "busy professionals" : "special items"}
                  </div>
                </div>
              </div>
              
              {/* Service Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">Processing Time</p>
                  <p className="font-semibold text-gray-800">
                    {selectedService.name === "Full Package" ? "24-48 hours" : 
                     selectedService.name === "Wash Package" ? "24  hours" : 
                     selectedService.name === "Dry Package" ? "24 hours" : "48-72 hours"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">User Rating</p>
                  <div className="flex items-center">
                    <Star size={16} fill="#FFDD00" color="#FFDD00" className="mr-1" />
                    <span className="font-semibold text-gray-800">
                      {selectedService.name === "Full Package" ? "4.9/5" : 
                       selectedService.name === "Wash Package" ? "4.7/5" : 
                       selectedService.name === "Dry Package" ? "4.8/5" : "5.0/5"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">Orders Today</p>
                  <p className="font-semibold text-gray-800">
                    {selectedService.name === "Full Package" ? "124" : 
                     selectedService.name === "Wash Package" ? "86" : 
                     selectedService.name === "Dry Package" ? "57" : "32"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">Special Offer</p>
                  <p className="font-semibold text-green-600">
                    {selectedService.name === "Full Package" ? "10% Off" : 
                     selectedService.name === "Wash Package" ? "Free Delivery" : 
                     selectedService.name === "Dry Package" ? "Express Option" : "Free Add-ons"}
                  </p>
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
                        <p className="text-blue-600 text-sm mt-1">
                          {selectedService.name === "Full Package" ? "Fabric Softener (+$3)" : 
                           selectedService.name === "Wash Package" ? "Stain Treatment (+$2)" : 
                           selectedService.name === "Dry Package" ? "Wrinkle-Free Option (+$4)" : "Special Handling (+$5)"}
                        </p>
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
                        <div key={index} className={`flex justify-between p-3 rounded-lg ${index === 0 ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-100'}`}>
                          <div className="flex items-center">
                            <div className={`w-2 h-6 rounded-sm mr-3 ${
                              index === 0 ? 'bg-green-400' : 
                              index === 1 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></div>
                            <span className={`font-medium ${index === 0 ? 'text-green-800' : 'text-gray-800'}`}>
                              {pricing.weight}
                              {index === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">POPULAR</span>}
                            </span>
                          </div>
                          <span className={`font-bold text-lg ${index === 0 ? 'text-green-600' : 'text-gray-800'}`}>{pricing.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-5 p-3 bg-gray-100 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Additional Options</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Check size={14} className="text-green-500 mr-1" />
                          <span>Express Service (+$10)</span>
                        </div>
                        <div className="flex items-center">
                          <Check size={14} className="text-green-500 mr-1" />
                          <span>Eco-Friendly (+$5)</span>
                        </div>
                        <div className="flex items-center">
                          <Check size={14} className="text-green-500 mr-1" />
                          <span>Delivery (+$7)</span>
                        </div>
                        <div className="flex items-center">
                          <Check size={14} className="text-green-500 mr-1" />
                          <span>Fragrance (+$3)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex">
                      <div className="mr-3 text-yellow-500">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800">Time-Saving Tip</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          {selectedService.name === "Full Package" ? "Schedule recurring orders for 15% discount on your next order." : 
                           selectedService.name === "Wash Package" ? "Drop-off before 9AM for same-day service." : 
                           selectedService.name === "Dry Package" ? "Add express service for 3-hour turnaround." : "Save your preferences for faster checkout next time."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial for this service */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold text-blue-600">
                      {selectedService.name === "Full Package" ? "TJ" : 
                       selectedService.name === "Wash Package" ? "MK" : 
                       selectedService.name === "Dry Package" ? "AL" : "RB"}
                    </span>
                  </div>
                  <div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="#FFDD00" color="#FFDD00" />
                      ))}
                      <span className="ml-2 text-gray-500 text-sm">Verified Customer</span>
                    </div>
                    <p className="text-gray-700 italic mb-2">"{
                      selectedService.name === "Full Package" ? "I've tried many laundry services, but this Full Package is truly exceptional. Everything comes back perfectly clean and neatly folded!" : 
                      selectedService.name === "Wash Package" ? "The Wash Package is perfect for my weekly needs. Affordable, efficient, and my clothes smell amazing." : 
                      selectedService.name === "Dry Package" ? "As someone who washes at home but hates drying, this Dry Package is a lifesaver. Quick and perfect results every time." : 
                      "The Custom Package let me specify exactly how I wanted my delicate garments handled. Outstanding service!"
                    }"</p>
                    <p className="text-sm text-gray-500">
                      {selectedService.name === "Full Package" ? "Tom J. - Customer since 2023" : 
                       selectedService.name === "Wash Package" ? "Maria K. - Customer since 2024" : 
                       selectedService.name === "Dry Package" ? "Alex L. - Customer since 2022" : 
                       "Rachel B. - Customer since 2025"}
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
                  <button className="flex-1 mr-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center justify-center">
                    <DollarSign size={18} className="mr-1" /> 
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing exceptional laundry care with attention to detail and quality results.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Turnaround</h3>
              <p className="text-gray-600">Get your clothes back fresh and clean in as little as 24 hours with our express service options.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">We use premium detergents and modern equipment to ensure your clothes receive the best care possible.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <DollarSign className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Enjoy premium laundry services at affordable rates with transparent pricing based on weight.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our satisfied customers have to say about our services.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="#FFDD00" color="#FFDD00" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">"The Full Package service is amazing! My clothes came back perfectly clean and neatly folded. Will definitely use the service again."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="font-medium text-blue-600">JD</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">John Doe</h4>
                <p className="text-gray-500 text-sm">Regular Customer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="#FFDD00" color="#FFDD00" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">"I had some delicate items that needed special care, and the Custom Package was perfect. Great attention to detail!"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="font-medium text-green-600">JS</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Jane Smith</h4>
                <p className="text-gray-500 text-sm">New Customer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="#FFDD00" color="#FFDD00" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">"Fast, efficient, and professional service. The Wash Package is budget-friendly and does the job perfectly. Highly recommended!"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <span className="font-medium text-amber-600">RJ</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Robert Johnson</h4>
                <p className="text-gray-500 text-sm">Monthly Subscriber</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Premium Laundry Service?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who trust us with their laundry needs. First-time customers get 15% off!</p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition duration-300 inline-flex items-center">
            Book Your Service Now <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}