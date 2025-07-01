import React from 'react';
import { Check, Clock, DollarSign} from 'lucide-react';

// Why Choose Us Section
const ServiceSection3 = () => {
    return (
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
    );
    }

export default ServiceSection3;