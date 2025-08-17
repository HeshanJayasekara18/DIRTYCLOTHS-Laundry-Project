import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import your assets - you'll need to adjust paths based on your project structure
import laundryIcon from "../../images/laundry-icon.png"; 
import laundrysplash from "../../images/laundry-splash.gif";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set loaded state to true once component mounts
    setIsLoaded(true);
  }, []);

  const handleOrderNow = () => {
    navigate("/services");
  };

  return (
    <section id="section1" className="relative overflow-hidden min-h-[600px] md:min-h-[90vh]">
      {/* Background image with darkened overlay */}
      <div 
         className="absolute inset-0 z-0 bg-cover bg-center"
         style={{
         backgroundImage: `url(${laundrysplash})`,
         filter: "brightness(0.6)"
      }}
       />
      
      {/* Purple gradient overlay to match your design */}
      <div className="absolute inset-0 z-0 bg-indigo-900/40"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
        <div className="flex flex-col md:flex-row h-full items-center justify-between py-16">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 text-white mb-12 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg leading-tight">
              Feel Your Way For<br />Freshness
            </h1>
            
            <div className="text-lg md:text-xl mb-8 max-w-lg">
              <p className="mb-4">
                Fresh, clean clothes—without the hassle. 
                DIRTYCLOTHS makes laundry day effortless with fast
                pickup and delivery. Affordable pricing, reliable service,
                and a satisfaction guarantee.
              </p>
              <p>Let us handle the dirty work—so you don't have to.</p>
            </div>
            
            <button 
              onClick={handleOrderNow}
              className="bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 flex items-center shadow-lg"
            >
              Wash Now
              <img 
                src={laundryIcon} 
                alt="Laundry" 
                className="ml-2 h-6 w-6"
              />
            </button>
          </div>
          
          {/* Right side - GIF/Image with circular frame */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div 
              className={`rounded-full border-4 border-blue-300 shadow-2xl overflow-hidden transition-opacity duration-1000 splash-animation ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
              style={{ width: "400px", height: "400px" }}
            >
              {/* Animated laundry splash GIF */}
              <img 
                src={laundrysplash} 
                alt="Laundry splash animation" 
                className="w-full h-full object-cover"
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Light effect overlay for added dimension */}
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-white opacity-10 blur-3xl transform -rotate-12"></div>
    </section>
  );
}