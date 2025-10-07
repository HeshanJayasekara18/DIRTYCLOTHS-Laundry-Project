import { useState, useEffect } from "react";
import homesection4bg from '../../images/homesection4bg.png';

function Section4() {
    // Enhanced services data with gradient colors and better icons
    const services = [
        {
            id: 1,
            title: "Pick up & Drop Off",
            gradient: "from-pink-400 to-red-500",
            bgGradient: "from-pink-50 to-red-50",
            icon: (
                <svg viewBox="0 0 100 100" className="w-20 h-20 mb-4">
                    <defs>
                        <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff6b6b" />
                            <stop offset="100%" stopColor="#ff8787" />
                        </linearGradient>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                        </filter>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#truckGrad)" filter="url(#shadow)" opacity="0.15" />
                    <g transform="translate(15, 20)">
                        <path d="M5,35 L45,35 L55,20 L55,35 L55,49 L5,49 Z" fill="url(#truckGrad)" />
                        <rect x="0" y="35" width="8" height="14" fill="#4a4a4a" rx="2" />
                        <circle cx="12" cy="49" r="7" fill="#2d3748" />
                        <circle cx="40" cy="49" r="7" fill="#2d3748" />
                        <circle cx="12" cy="49" r="4" fill="#e2e8f0" />
                        <circle cx="40" cy="49" r="4" fill="#e2e8f0" />
                        <circle cx="12" cy="15" r="12" fill="#ffffff" stroke="#4a5568" strokeWidth="2" />
                        <path d="M12,8 L12,15 L19,15" stroke="#4a5568" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                </svg>
            ),
            description: "Seamless pickup and delivery service that brings professional laundry care right to your doorstep with real-time tracking."
        },
        {
            id: 2,
            title: "Premium Washing",
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            icon: (
                <svg viewBox="0 0 100 100" className="w-20 h-20 mb-4">
                    <defs>
                        <linearGradient id="washGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#washGrad)" opacity="0.15" />
                    <g transform="translate(20, 12)">
                        <rect x="0" y="0" width="60" height="12" fill="#6366f1" rx="6" />
                        <rect x="3" y="12" width="54" height="65" fill="#e2e8f0" rx="4" />
                        <circle cx="30" cy="45" r="22" fill="url(#washGrad)" opacity="0.8" />
                        <circle cx="30" cy="45" r="18" fill="#ffffff" opacity="0.4" />
                        <circle cx="30" cy="45" r="12" fill="url(#washGrad)" opacity="0.6" />
                        <rect x="12" y="12" width="36" height="8" fill="#4a5568" rx="2" />
                        <circle cx="52" cy="18" r="3" fill="#ef4444" />
                        <circle cx="45" cy="18" r="2" fill="#10b981" />
                    </g>
                </svg>
            ),
            description: "Advanced washing technology with eco-friendly detergents and fabric-specific care programs for optimal results."
        },
        {
            id: 3,
            title: "Gentle Drying",
            gradient: "from-orange-400 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            icon: (
                <svg viewBox="0 0 100 100" className="w-20 h-20 mb-4">
                    <defs>
                        <linearGradient id="dryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#dryGrad)" opacity="0.15" />
                    <g transform="translate(25, 15)">
                        <rect x="0" y="10" width="50" height="45" fill="url(#dryGrad)" rx="4" />
                        <rect x="15" y="5" width="20" height="8" fill="#fbbf24" rx="4" />
                        <circle cx="25" cy="9" r="2" fill="#ffffff" />
                        <g className="animate-pulse">
                            <path d="M10,25 Q15,20 20,25 T30,25 T40,25" stroke="#fbbf24" strokeWidth="2" fill="none" />
                            <path d="M10,35 Q15,30 20,35 T30,35 T40,35" stroke="#fbbf24" strokeWidth="2" fill="none" />
                            <path d="M10,45 Q15,40 20,45 T30,45 T40,45" stroke="#fbbf24" strokeWidth="2" fill="none" />
                        </g>
                    </g>
                </svg>
            ),
            description: "Temperature-controlled drying process that preserves fabric integrity while ensuring complete moisture removal."
        },
        {
            id: 4,
            title: "Professional Press",
            gradient: "from-yellow-400 to-orange-500",
            bgGradient: "from-yellow-50 to-orange-50",
            icon: (
                <svg viewBox="0 0 100 100" className="w-20 h-20 mb-4">
                    <defs>
                        <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#ironGrad)" opacity="0.15" />
                    <g transform="translate(15, 35)">
                        <path d="M5,15 L55,15 L70,0 L15,0 Z" fill="url(#ironGrad)" />
                        <path d="M15,0 L55,15 L70,0 Z" fill="#ea580c" />
                        <circle cx="25" cy="8" r="2" fill="#ffffff" opacity="0.8" />
                        <circle cx="35" cy="8" r="2" fill="#ffffff" opacity="0.8" />
                        <circle cx="45" cy="8" r="2" fill="#ffffff" opacity="0.8" />
                        <path d="M60,0 C65,5 70,15 65,20" stroke="#6b7280" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M65,5 C68,8 70,12 68,16" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                </svg>
            ),
            description: "Expert pressing and ironing services that deliver crisp, professional results for all garment types."
        },
        {
            id: 5,
            title: "Stain Removal",
            gradient: "from-green-400 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            icon: (
                <svg viewBox="0 0 100 100" className="w-20 h-20 mb-4">
                    <defs>
                        <linearGradient id="stainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#stainGrad)" opacity="0.15" />
                    <g transform="translate(20, 15)">
                        <path d="M30,5 L55,45 L5,45 Z" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
                        <circle cx="30" cy="25" r="8" fill="#ef4444" opacity="0.7" />
                        <circle cx="25" cy="20" r="4" fill="#f87171" opacity="0.5" />
                        <g className="animate-bounce">
                            <circle cx="30" cy="25" r="10" fill="url(#stainGrad)" opacity="0.3" />
                            <path d="M22,35 L38,35" stroke="url(#stainGrad)" strokeWidth="3" strokeLinecap="round" />
                            <path d="M20,40 L40,40" stroke="url(#stainGrad)" strokeWidth="2" strokeLinecap="round" />
                        </g>
                    </g>
                </svg>
            ),
            description: "Advanced stain removal techniques that tackle the toughest spots while maintaining fabric quality and color."
        },
        {
            id: 6,
            title: "Shoe Care",
            gradient: "from-purple-400 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            icon: (
                <svg viewBox="0 0 100 100" className="w-20 h-20 mb-4">
                    <defs>
                        <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#shoeGrad)" opacity="0.15" />
                    <g transform="translate(15, 25)">
                        <path d="M5,25 C5,15 15,5 25,5 C35,5 45,5 55,5 C65,5 65,20 65,25 L5,25 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                        <path d="M5,25 L65,25 L65,35 C65,40 55,45 35,45 C15,45 5,40 5,35 Z" fill="url(#shoeGrad)" />
                        <ellipse cx="35" cy="15" rx="15" ry="3" fill="#e2e8f0" />
                        <path d="M20,15 L50,15" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="60" cy="15" r="2" fill="#ffffff" opacity="0.8" />
                    </g>
                </svg>
            ),
            description: "Specialized shoe cleaning and restoration service that revitalizes footwear while preserving original materials."
        }
    ];

    const [hoveredId, setHoveredId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotate active service for visual interest
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % services.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [services.length]);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Your Background Image */}
            <div className="absolute inset-0">
                <img
                    src={homesection4bg}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                {/* Subtle overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-50/25 to-indigo-100/30"></div>
            </div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Enhanced Header */}
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
                            Our Premium Services
                        </h2>
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full transform scale-x-0 animate-scale-x animation-delay-500"></div>
                    </div>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mt-8 leading-relaxed font-light">
                        Experience the future of laundry care with our comprehensive suite of professional services. 
                        From cutting-edge cleaning technology to personalized care, we transform the way you think about laundry.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`group relative overflow-hidden rounded-3xl transition-all duration-700 transform cursor-pointer
                                ${hoveredId === service.id 
                                    ? 'scale-105 -rotate-1' 
                                    : activeIndex === index 
                                        ? 'scale-102 shadow-2xl' 
                                        : 'hover:scale-102'
                                }
                            `}
                            onMouseEnter={() => setHoveredId(service.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Animated border */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-3xl p-1 transition-all duration-500
                                ${hoveredId === service.id || activeIndex === index ? 'opacity-100' : 'opacity-0'}
                            `}>
                                <div className="w-full h-full bg-white rounded-3xl"></div>
                            </div>
                            
                            {/* Card Content */}
                            <div className={`
                                relative bg-gradient-to-br ${service.bgGradient} rounded-3xl p-8 text-center 
                                border border-white/50 shadow-xl backdrop-blur-sm
                                flex flex-col items-center justify-center h-80
                                transition-all duration-700 group-hover:bg-white/90
                            `}>
                                {/* Floating icon container */}
                                <div className={`
                                    relative transition-all duration-700 transform
                                    ${hoveredId === service.id 
                                        ? 'scale-110 -translate-y-3 rotate-6' 
                                        : activeIndex === index 
                                            ? 'scale-105 -translate-y-1' 
                                            : ''
                                    }
                                `}>
                                    {/* Icon glow effect */}
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-full blur-xl opacity-0 transition-all duration-500
                                        ${hoveredId === service.id || activeIndex === index ? 'opacity-30' : ''}
                                    `}></div>
                                    <div className="relative">
                                        {service.icon}
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                
                                {/* Animated description */}
                                <div className={`
                                    overflow-hidden transition-all duration-700 ease-out
                                    ${hoveredId === service.id 
                                        ? 'max-h-40 opacity-100' 
                                        : activeIndex === index 
                                            ? 'max-h-32 opacity-90' 
                                            : 'max-h-0 opacity-0'
                                    }
                                `}>
                                    <p className="text-gray-600 leading-relaxed px-2 text-sm md:text-base">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Service number badge */}
                                <div className={`
                                    absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r ${service.gradient} 
                                    flex items-center justify-center text-white font-bold text-sm
                                    transform transition-all duration-500
                                    ${hoveredId === service.id ? 'scale-125 rotate-12' : ''}
                                `}>
                                    {service.id}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced CTA Section */}
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center space-x-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-20"></div>
                        <span className="text-black-600 font-semibold text-lg">Ready to experience the difference?</span>
                        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-20"></div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                            <span className="relative z-10 flex items-center space-x-2">
                                <span>Order Now</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                        
                        <button className="group bg-white/80 backdrop-blur-sm text-gray-800 font-semibold py-4 px-8 rounded-full border-2 border-gray-200 transition-all duration-300 hover:bg-white hover:shadow-xl hover:border-blue-300">
                            <span className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Get Quote</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                @keyframes scale-x {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                
                .animate-scale-x {
                    animation: scale-x 1s ease-out forwards;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}

export default Section4;