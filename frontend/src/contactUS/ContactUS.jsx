import React, { useState, useEffect } from 'react';
import Navbar from '../common/navbar/Navbar';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  User, 
  Send, 
  Truck,
  CheckCircle,
  Sparkles,
  Waves,
  Navigation,
  Heart,
  Star
} from 'lucide-react';
import Footer from '../home/footer/Footer';
import LaundryMap from './map-api/MapDisplay';

const ContactUS = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE; // Railway backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Generate unique contactID
    const contactID = `contact_${Date.now()}`;
    
    const dataToSend = {
      ...formData,
      contactID
    };

    try {
      const response = await fetch("http://localhost:5000/api/contact/add" || `${API_BASE_URL}/api/contact/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });


      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
        setFormErrors({});
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', error.message);
      alert(`Error submitting form: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+94 72 163 4671"],
      subtitle: "Available 7 days a week",
      color: "from-green-400 to-emerald-500",
      action: "tel:+94721634671"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["hello@dirtycloths.lk", "info@dirtycloths.lk"],
      subtitle: "We reply within 2 hours",
      color: "from-blue-400 to-cyan-500",
      action: "mailto:hello@dirtycloths.lk"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["Amuwatta koratuwa", "Midigama, Ahangama"],
      subtitle: "Next to the surf break",
      color: "from-purple-400 to-pink-500",
      action: "https://maps.google.com/search/Midigama+Ahangama"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Mon-Sat: 6:00 AM - 10:00 PM", "Sunday: 7:00 AM - 8:00 PM"],
      subtitle: "Express service available",
      color: "from-orange-400 to-red-500"
    }
  ];

  const services = [
    "Regular Wash & Fold",
    "Express 24h Service", 
    "Dry Cleaning",
    "Surf Gear Cleaning",
    "Pickup & Delivery",
    "Other Services"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-24">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <MessageCircle className="w-16 h-16 text-white mr-4 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Heart className="w-3 h-3 text-red-500" />
                </div>
              </div>
              <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight">
                GET IN <span className="text-yellow-300 animate-pulse">TOUCH</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-3xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ready to experience the <span className="text-yellow-300 font-semibold">freshest laundry service</span> in Midigama? 
              <br />Let's make your clothes sparkle like the ocean! ✨
            </p>
            
            <div className="flex items-center justify-center text-white mb-8">
              <Waves className="w-6 h-6 mr-3 animate-bounce" />
              <span className="text-xl font-medium">We're just a wave away from helping you</span>
              <Waves className="w-6 h-6 ml-3 animate-bounce delay-500" />
            </div>
            
            {/* Quick Action Buttons in Hero */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a 
                href="tel:+94721634671"
                className="bg-white/20 backdrop-blur-md text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-2xl inline-flex items-center justify-center border border-white/30"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
              <a 
                href="https://wa.me/+94721634671"
                className="bg-green-500/90 backdrop-blur-md text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl inline-flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-10 left-10 animate-spin-slow">
          <Sparkles className="w-12 h-12 text-yellow-300 opacity-60" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce">
          <Star className="w-8 h-8 text-white opacity-80" />
        </div>
        <div className="absolute bottom-20 left-32 animate-pulse">
          <Truck className="w-12 h-12 text-white opacity-80" />
        </div>
        <div className="absolute bottom-32 right-10 animate-spin-slow">
          <Sparkles className="w-10 h-10 text-pink-300 opacity-60" />
        </div>
      </div>

      {/* Enhanced Contact Info Cards */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How to <span className="text-indigo-600">Reach Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Multiple ways to connect with Midigama's most trusted laundry service
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full group cursor-pointer transform hover:scale-105 ${
                  hoveredCard === index ? 'ring-4 ring-indigo-200' : ''
                }`}
                onClick={() => info.action && window.open(info.action)}
              >
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${info.color} text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {info.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {info.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-medium text-lg">
                      {detail}
                    </p>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 italic font-medium bg-gray-50 px-3 py-2 rounded-full">
                  {info.subtitle}
                </p>
                
                {hoveredCard === index && (
                  <div className="mt-4 text-indigo-600 font-semibold text-sm flex items-center">
                    <Navigation className="w-4 h-4 mr-1" />
                    Click to {info.action ? 'contact' : 'view'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid xl:grid-cols-5 gap-12">
          {/* Enhanced Contact Form */}
          <div className={`xl:col-span-2 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 transform translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full opacity-10 transform -translate-x-16 translate-y-16"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-800 mb-3">
                    Send us a <span className="text-indigo-600">Message</span>
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Tell us about your laundry needs and we'll get back to you faster than a Midigama sunset! 🌅
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="bg-green-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                    </div>
                    <h3 className="text-3xl font-bold text-green-600 mb-4">Message Sent Successfully! 🎉</h3>
                    <p className="text-gray-600 text-lg mb-4">
                      Thanks for reaching out! We'll contact you within 2 hours.
                    </p>
                    <div className="bg-green-50 rounded-2xl p-4">
                      <p className="text-green-700 font-semibold">
                        💬 You can also WhatsApp us for instant replies!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Name *"
                          className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg ${
                            formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                      
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email *"
                          className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg ${
                            formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your Phone Number"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
                      />
                    </div>

                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white text-lg"
                      >
                        <option value="">Select Service (Optional)</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your laundry needs... *"
                        rows={5}
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none text-lg ${
                          formErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.message && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-4 h-4 mr-1">⚠️</span>
                          {formErrors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-lg ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </span>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          Send Message 🚀
                        </>
                      )}
                    </button>
                    
                    <p className="text-sm text-gray-500 text-center">
                      * Required fields
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Map & Services Section */}
          <div className={`xl:col-span-3 space-y-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Map Section */}
            <LaundryMap />

            {/* Enhanced Quick Services */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-8 flex items-center">
                  <Sparkles className="w-8 h-8 mr-3" />
                  Our Quick Services
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <Truck className="w-8 h-8 mr-4 text-yellow-300" />
                      <div>
                        <p className="font-bold text-xl">Free Pickup & Delivery</p>
                        <p className="text-pink-100">Within 5km of Midigama</p>
                      </div>
                    </div>
                    <p className="text-sm text-pink-100">
                      Perfect for busy surfers and travelers! We'll collect and deliver your clothes.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <Clock className="w-8 h-8 mr-4 text-yellow-300" />
                      <div>
                        <p className="font-bold text-xl">Express 24h Service</p>
                        <p className="text-pink-100">Perfect for surf trips</p>
                      </div>
                    </div>
                    <p className="text-sm text-pink-100">
                      Need clothes cleaned quickly? Our express service gets you beach-ready fast!
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <MessageCircle className="w-8 h-8 mr-4 text-yellow-300" />
                      <div>
                        <p className="font-bold text-xl">WhatsApp Updates</p>
                        <p className="text-pink-100">Track your laundry status</p>
                      </div>
                    </div>
                    <p className="text-sm text-pink-100">
                      Get real-time updates on your laundry progress via WhatsApp messaging.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <Heart className="w-8 h-8 mr-4 text-yellow-300" />
                      <div>
                        <p className="font-bold text-xl">Surf Gear Specialist</p>
                        <p className="text-pink-100">We know your wetsuit</p>
                      </div>
                    </div>
                    <p className="text-sm text-pink-100">
                      Special care for wetsuits, board shorts, and all your surf equipment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Call to Action */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 text-center">
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Need Laundry Done <span className="text-yellow-300">Right Now?</span>
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-4xl mx-auto leading-relaxed">
              Don't let dirty clothes ruin your Midigama adventure! Call us directly for immediate assistance or emergency laundry services! 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <a 
                href="tel:+94721634671"
                className="bg-white text-indigo-600 font-bold py-5 px-10 rounded-full text-xl hover:bg-yellow-300 hover:text-indigo-700 transform hover:scale-110 transition-all duration-300 shadow-2xl inline-flex items-center justify-center"
              >
                <Phone className="w-6 h-6 mr-3" />
                Call Now 📞
              </a>
              <a 
                href="https://wa.me/+94721634671"
                className="bg-green-500 text-white font-bold py-5 px-10 rounded-full text-xl hover:bg-green-600 transform hover:scale-110 transition-all duration-300 shadow-2xl inline-flex items-center justify-center"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                WhatsApp Us 💬
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-white text-lg font-semibold mb-2">
                🏄‍♂️ Surfer's Special Guarantee:
              </p>
              <p className="text-indigo-100">
                "Your clothes will be cleaner than the waves at Coconut Tree Hill!"
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUS;