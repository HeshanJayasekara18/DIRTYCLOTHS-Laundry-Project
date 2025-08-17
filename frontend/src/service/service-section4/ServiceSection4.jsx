import { Star} from 'lucide-react';

const ServiceSection4 = () => {
    return (
        <>
            {/* Testimonials Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our satisfied customers have to say about our services.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={18} fill="#FFDD00" color="#FFDD00" />
                            ))}
                        </div>
                        <p className="text-gray-600 mb-4">"The Full Package service is amazing! My clothes came back perfectly clean and neatly folded. Will definitely use the service again."</p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="font-medium text-blue-600">JD</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">John Doe</h4>
                                <p className="text-gray-500 text-sm">Regular Customer</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={18} fill="#FFDD00" color="#FFDD00" />
                            ))}
                        </div>
                        <p className="text-gray-600 mb-4">"I had some delicate items that needed special care, and the Custom Package was perfect. Great attention to detail!"</p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span className="font-medium text-green-600">JS</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Jane Smith</h4>
                                <p className="text-gray-500 text-sm">New Customer</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={18} fill="#FFDD00" color="#FFDD00" />
                            ))}
                        </div>
                        <p className="text-gray-600 mb-4">"Fast, efficient, and professional service. The Wash Package is budget-friendly and does the job perfectly. Highly recommended!"</p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                <span className="font-medium text-amber-600">RJ</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Robert Johnson</h4>
                                <p className="text-gray-500 text-sm">Monthly Subscriber</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceSection4;