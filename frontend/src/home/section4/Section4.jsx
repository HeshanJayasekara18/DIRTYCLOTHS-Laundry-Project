import { useState } from "react";
import homesection4bg from '../../images/homesection4bg.png';

function Section4() {
    // Services data array
    const services = [
        {
            id: 1,
            title: "Pick up & Drop Off",
            icon: (
                <svg viewBox="0 0 100 100" className="w-16 h-16 mb-3">
                    <circle cx="50" cy="50" r="45" fill="#ff8a8a" opacity="0.7" />
                    <g transform="translate(20, 23)">
                        <path d="M10,40 L50,40 L60,25 L60,40 L60,54 L10,54 Z" fill="#f7c675" />
                        <rect x="0" y="40" width="10" height="14" fill="#666" />
                        <circle cx="15" cy="54" r="6" fill="#333" />
                        <circle cx="45" cy="54" r="6" fill="#333" />
                        <circle cx="15" cy="20" r="15" fill="white" stroke="#333" strokeWidth="2" />
                        <path d="M15,12 L15,20 L23,20" stroke="#333" strokeWidth="2" fill="none" />
                    </g>
                </svg>
            ),
            description: "We'll pick up your dirty clothes and deliver them clean right to your doorstep, saving you time and hassle."
        },
        {
            id: 2,
            title: "Washing",
            icon: (
                <svg viewBox="0 0 100 100" className="w-16 h-16 mb-3">
                    <circle cx="50" cy="50" r="45" fill="#7cd4eb" opacity="0.7" />
                    <g transform="translate(20, 15)">
                        <rect x="0" y="0" width="60" height="10" fill="#ffacac" rx="2" />
                        <rect x="5" y="10" width="50" height="60" fill="#e0e0e0" rx="2" />
                        <circle cx="30" cy="40" r="20" fill="#7cd4eb" />
                        <circle cx="30" cy="40" r="15" fill="white" opacity="0.3" />
                        <rect x="15" y="10" width="30" height="8" fill="#333" />
                        <rect x="55" y="15" width="5" height="5" fill="#333" rx="1" />
                        <path d="M15,65 L25,65" stroke="#ffacac" strokeWidth="5" strokeLinecap="round" />
                    </g>
                </svg>
            ),
            description: "Our professional washing service uses premium detergents and the perfect water temperature for each fabric type."
        },
        {
            id: 3,
            title: "Drying",
            icon: (
                <svg viewBox="0 0 100 100" className="w-16 h-16 mb-3">
                    <circle cx="50" cy="50" r="45" fill="#ff8a8a" opacity="0.7" />
                    <g transform="translate(25, 15)">
                        <path d="M25,10 L45,10 L45,50 L25,50 L5,50 L5,10 Z" fill="#ff8a8a" />
                        <rect x="15" y="5" width="20" height="5" fill="#ffe066" />
                        <rect x="25" y="0" width="3" height="5" fill="#ffe066" />
                        <rect x="18" y="0" width="3" height="5" fill="#ffe066" />
                        <rect x="32" y="0" width="3" height="5" fill="#ffe066" />
                    </g>
                </svg>
            ),
            description: "Gentle drying techniques preserve the quality and extend the life of your clothes while preventing shrinkage."
        },
        {
            id: 4,
            title: "Iron",
            icon: (
                <svg viewBox="0 0 100 100" className="w-16 h-16 mb-3">
                    <circle cx="50" cy="50" r="45" fill="#666" opacity="0.4" />
                    <g transform="translate(15, 40)">
                        <path d="M0,10 L60,10 L70,0 L10,0 Z" fill="#ffe066" />
                        <path d="M10,0 L60,10 L70,0 Z" fill="#ffcc00" />
                        <path d="M65,0 C65,0 75,10 68,18" stroke="#666" strokeWidth="2" fill="none" />
                    </g>
                </svg>
            ),
            description: "Professional pressing and ironing to give your garments that crisp, wrinkle-free finish for a polished look."
        },
        {
            id: 5,
            title: "Stain Removal",
            icon: (
                <svg viewBox="0 0 100 100" className="w-16 h-16 mb-3">
                    <circle cx="50" cy="50" r="45" fill="#a1e0a8" opacity="0.7" />
                    <g transform="translate(25, 20)">
                        <path d="M25,0 L50,40 L0,40 Z" fill="white" />
                        <circle cx="25" cy="20" r="8" fill="#ff6b6b" />
                        <path d="M20,35 L30,35" stroke="#333" strokeWidth="2" />
                        <path d="M18,30 L32,30" stroke="#333" strokeWidth="2" />
                    </g>
                </svg>
            ),
            description: "Our specialized stain removal techniques tackle even the toughest spots without damaging your fabrics."
        },
        {
            id: 6,
            title: "Shoe Laundry",
            icon: (
                <svg viewBox="0 0 100 100" className="w-16 h-16 mb-3">
                    <circle cx="50" cy="50" r="45" fill="#c5a8e0" opacity="0.7" />
                    <g transform="translate(20, 30)">
                        <path d="M0,20 C0,10 10,0 20,0 C30,0 40,0 50,0 C60,0 60,15 60,20 L0,20 Z" fill="#e0e0e0" />
                        <path d="M0,20 L60,20 L60,30 C60,35 50,40 30,40 C10,40 0,35 0,30 Z" fill="#333" />
                    </g>
                </svg>
            ),
            description: "Restore your footwear with our specialized shoe cleaning service that deep cleans while preserving materials."
        }
    ];

    // State for hover effect
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="relative bg-white">
            <div className="absolute inset-0 h-full w-full">
                <img
                    src={homesection4bg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-8 py-10">
                <h2 className="text-5xl font-bold text-center mb-10 drop-shadow-lg">
                    Our Services
                </h2>
                <p className="text-lg text-center max-w-4xl mx-auto mb-12">
                    At DirtyClouths, we provide a complete range of laundry services to make your life easier. Whether you need a full wash
                    and dry with ironing, wash-only, or dry-only options, we've got you covered.
                    Our expert team also specializes in stain removal to help restore your clothes to their best condition.
                    We even offer professional shoe laundry services to keep your footwear looking fresh.
                    No matter the fabric or need, we deliver quality care with every load.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="relative overflow-hidden rounded-2xl transition-all duration-300 transform"
                            onMouseEnter={() => setHoveredId(service.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className={`
                                bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-lg
                                flex flex-col items-center justify-center h-64
                                transition-all duration-500
                                ${hoveredId === service.id ? 'scale-105 shadow-xl' : ''}
                            `}>
                                <div className={`
                                    transition-all duration-500 transform
                                    ${hoveredId === service.id ? 'scale-110 -translate-y-2' : ''}
                                `}>
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                <div className={`
                                    overflow-hidden transition-all duration-500
                                    ${hoveredId === service.id ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                                `}>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Section4;