import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Check, DollarSign, Package, Shirt, Droplet, Settings, X, MapPin, Droplets, Sparkles } from 'lucide-react';

const ServiceSection1 = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        // Hero Section
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative container mx-auto px-6 py-20">
                <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex items-center justify-center mb-6">
                        <Shirt className="w-12 h-12 text-white mr-4 animate-bounce" />
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                            PROFESSIONAL<span className="text-yellow-300">LAUNDRY</span>
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Experience premium care for your clothes with our expert washing, drying, and folding services
                    </p>
                    <div className="flex items-center justify-center text-white mb-6">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={20} fill="#FFDD00" color="#FFDD00" />
                            ))}
                        </div>
                        <span className="ml-2 text-white">Trusted by 10,000+ customers</span>
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
    );
}

export default ServiceSection1;