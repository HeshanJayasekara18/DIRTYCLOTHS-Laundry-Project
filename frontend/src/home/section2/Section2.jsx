import React from 'react';
import bestpriceicon from "../../images/best-price.png"; // Import your icon directly
import team from "../../images/team.png"; // Import your icon directly
import quality from "../../images/quality-service.png"; // Import your icon directly
const Section2 = () => {
  const features = [
    {
      icon: (
        <img src={team} alt="Team Icon" width="36" height="36" />
      ),
      title: "Expert Team",
      description: "Trained professionals who handle your clothes with the utmost care and precision."
    },
    {
      icon: (
        <>
          <img src={quality} alt="Laundry Icon" width="36" height="36" />
        </>
      ),
      title: "Quality Service",
      description: "We use premium detergents and proven processes to ensure every load is spotless."
    },
    {
      icon: (
        <img src={bestpriceicon} alt="Best Price Icon" width="36" height="36" />
      ),
      title: "Affordable Price",
      description: "Top-notch laundry care at prices that fit your budget —no hidden fees."
    }
  ];

  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-purple-200 rounded-xl p-6"
              style={{ backgroundColor: "#bbc1f0" }} // This matches the exact color in your image
            >
              <div className="mb-4 text-black">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;