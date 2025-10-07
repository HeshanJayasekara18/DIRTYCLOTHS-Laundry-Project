import  { useState } from "react";

import laundrywash from "../../images/laundrywash.gif";
import './Section5.css'

// ...rest of your code...

const Section5 = () => {
    const [ setIsLoaded] = useState(false);
  return (
    <div className="flex flex-col md:flex-row  bg-blue-300 p-4 md:p-9 w-full">
        <div className="gifcontroller-section5">
            <div className="gifshape-section5">
                <img
                  src={laundrywash}
                  alt="Laundry splash animation"
                  onLoad={() => setIsLoaded(true)}
                />
            </div>
        </div>
      {/* Left side - Image */}
      {/* <div className="w-full md:w-1/2 flex justify-center md:justify-end p-4">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1601924589620-4f2a3b8c1e5d" 
            alt="Person holding clean laundry" 
            className="rounded-lg object-cover h-64 md:h-96"
          />
        </div>
      </div> */}

{/* Circular GIF controller positioned using custom CSS class */}
        

      {/* Right side - Text content */}
      <div className="w-full md:w-1/2 p-4 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 ml-20 text-gray-900">Who We are</h2>
        <p className="text-gray-800 text-sm md:text-base ml-20">
          Welcome to DIRTYCLOTHS Laundry Service, your trusted 
          laundry partner in Midigama. We specialize in providing fast, 
          reliable, and tourist-friendly laundry solutions for travelers 
          who value cleanliness, convenience, and quality. Located 
          just minutes from the beach, we understand the unique 
          needs of surfers, backpackers, and holidaymakers, offering 
          same-day service, eco-friendly practices, and affordable 
          pricing. At DIRTYCLOTHS, we're committed to keeping your 
          adventures fresh—one load at a time.
        </p>
      </div>
    </div>
  );
};

export default Section5;