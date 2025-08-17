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
  Waves
} from 'lucide-react';
import Footer from '../home/footer/Footer';

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
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    if (!formData.message.trim()) {
      alert('Please enter your message');
      return false;
    }
    
    return true;
  };

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
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
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["hello@dirtycloths.lk", "info@dirtycloths.lk"],
      subtitle: "We reply within 2 hours",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["Amuwatta koratuwa", "Midigama, Ahangama"],
      subtitle: "Next to the surf break",
      color: "from-purple-400 to-pink-500"
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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-white mr-4 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                GET IN <span className="text-yellow-300">TOUCH</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Ready to experience the freshest laundry service in Midigama? Let's chat!
            </p>
            <div className="flex items-center justify-center text-white">
              <Waves className="w-5 h-5 mr-2 animate-bounce" />
              <span className="text-lg">We're just a wave away from helping you</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 animate-spin-slow">
          <Sparkles className="w-8 h-8 text-yellow-300 opacity-60" />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce">
          <Truck className="w-10 h-10 text-white opacity-80" />
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group cursor-pointer transform hover:scale-105">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${info.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 mb-1 font-medium">
                    {detail}
                  </p>
                ))}
                <p className="text-sm text-gray-500 mt-2 italic">
                  {info.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Tell us about your laundry needs and we'll get back to you faster than a Midigama sunset!
                </p>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thanks for reaching out! We'll contact you within 2 hours.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your Phone Number"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                      >
                        <option value="">Select Service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your laundry needs..."
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map & Additional Info */}
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Find Us in Paradise</h3>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                <div className="text-center z-10">
                  <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-bounce" />
                  <p className="text-lg font-semibold text-gray-700">123 Coconut Tree Lane</p>
                  <p className="text-gray-600">Midigama, Matara</p>
                  <p className="text-sm text-gray-500 mt-2">Right next to the famous surf break!</p>
                </div>
              </div>
            </div>

            {/* Quick Services */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Quick Services</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Free Pickup & Delivery</p>
                    <p className="text-pink-100 text-sm">Within 5km of Midigama</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Express 24h Service</p>
                    <p className="text-pink-100 text-sm">Perfect for surf trips</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-yellow-300" />
                  <div>
                    <p className="font-semibold">WhatsApp Updates</p>
                    <p className="text-pink-100 text-sm">Track your laundry status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need Laundry Done Right Now?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Call us directly for immediate assistance or emergency laundry services!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+94721634671"
                className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-300 hover:text-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
              <a 
                href="https://wa.me/+94721634671"
                className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl inline-flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUS;