import Navbar from "../common/navbar/Navbar"
import  { useState, useEffect } from 'react';
import { Droplets, Heart, Users, Award, MapPin, Clock, Sparkles, Shirt } from 'lucide-react';
import Footer from '../home/footer/Footer';



export default function AboutUS() {
const [isVisible, setIsVisible] = useState(false);
  const [ setActiveCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const feturesvalues = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "We use biodegradable detergents and water-saving techniques to protect Midigama's beautiful coastline.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Care & Quality",
      description: "Every garment receives individual attention, treating your clothes like our own precious belongings.",
      color: "from-pink-400 to-rose-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "Born and raised in Midigama, we understand the local lifestyle and fabric care needs.",
      color: "from-purple-400 to-indigo-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "From beach wear to business attire, we deliver spotless results that exceed expectations.",
      color: "from-amber-400 to-orange-500"
    }
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "3", label: "Years of Service" },
    { number: "24h", label: "Express Service" },
    { number: "100%", label: "Satisfaction Rate" }
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
              <Shirt className="w-12 h-12 text-white mr-4 animate-bounce" />
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                DIRTY<span className="text-yellow-300">CLOTHS</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Where dirty becomes divine in beautiful Midigama, Sri Lanka
            </p>
            <div className="flex items-center justify-center text-white">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">Midigama, Southern Province, Sri Lanka</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <Droplets className="w-8 h-8 text-white opacity-60" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse delay-1000">
          <Sparkles className="w-10 h-10 text-yellow-300 opacity-80" />
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Story
            </h2>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
              <div className="relative z-10">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Born from the salty breeze and endless sunshine of Midigama, DIRTYCLOTHS began as a dream to serve our vibrant surf community and growing local families. What started as a small operation in 2022 has blossomed into the most trusted laundry service along the southern coast.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We understand the unique challenges of coastal living - sand-covered board shorts, salt-stained sundresses, and the constant battle against humidity. Our founder, inspired by the pristine beaches of Midigama, envisioned a laundry service that would treat every garment with the same care we give to preserving our beautiful environment.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, we're proud to be more than just a laundry service. We're your neighbors, your friends, and your partners in keeping life fresh and clean while you enjoy everything magical that Midigama has to offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            What Makes Us Special
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {feturesvalues.map((value, index) => (
              <div
                key={index}
                className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200 + 600}ms` }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${value.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                style={{ transitionDelay: `${index * 150 + 1000}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 hover:scale-110 transition-transform duration-300 cursor-default">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-1">
              <div className="bg-white rounded-3xl p-8 md:p-12">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  To provide exceptional laundry services that free up your time to enjoy the paradise that is Midigama, while maintaining the highest standards of care for your garments and our environment.
                </p>
                <div className="flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-600 mr-3" />
                  <span className="text-lg font-medium text-gray-800">
                    More time for surf, sun, and serenity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the DIRTYCLOTHS Difference?
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their precious garments in beautiful Midigama.
            </p>
            <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-300 hover:text-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};