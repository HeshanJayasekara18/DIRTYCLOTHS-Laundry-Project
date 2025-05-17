import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dummy feedback data
const feedbackData = [
  {
    id: 1,
    name: "Sasha Perry",
    level: "Level 3 User",
    rating: 4,
    comment: "Nisi vivamus neque elementum, at pharetra. Cras gravida congue in tincidunt neque, ipsum egestas. Duis risus ipsum dis commodo. Enim euismod velit amet volutpat egestas urna in eget pellentesque. Cras gravida congue in tincidunt neque, ipsum egestas"
  },
  {
    id: 2,
    name: "Andrew SI",
    level: "Level 4 User",
    rating: 5,
    comment: "Nisi vivamus neque elementum, at pharetra. Cras gravida congue in tincidunt neque, ipsum egestas. Duis risus ipsum dis commodo. Enim euismod velit amet volutpat egestas urna in eget pellentesque. Cras gravida congue in tincidunt neque, ipsum egestas"
  },
  {
    id: 3,
    name: "Jone Smith",
    level: "Level 3 User",
    rating: 4,
    comment: "Nisi vivamus neque elementum, at pharetra. Cras gravida congue in tincidunt neque, ipsum egestas. Duis risus ipsum dis commodo. Enim euismod velit amet volutpat egestas urna in eget pellentesque. Cras gravida congue in tincidunt neque, ipsum egestas"
  },
  {
    id: 4,
    name: "Emma Johnson",
    level: "Level 5 User",
    rating: 5,
    comment: "Nisi vivamus neque elementum, at pharetra. Cras gravida congue in tincidunt neque, ipsum egestas. Duis risus ipsum dis commodo. Enim euismod velit amet volutpat egestas urna in eget pellentesque."
  },
  {
    id: 5,
    name: "Michael Chen",
    level: "Level 2 User",
    rating: 4,
    comment: "Nisi vivamus neque elementum, at pharetra. Cras gravida congue in tincidunt neque, ipsum egestas. Duis risus ipsum dis commodo. Enim euismod velit amet volutpat."
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const FeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{feedback.name}</h3>
          <p className="text-gray-500 text-sm">{feedback.level}</p>
        </div>
        <StarRating rating={feedback.rating} />
      </div>
      <p className="text-gray-700 text-sm">{feedback.comment}</p>
    </div>
  );
};

export default function FeedbackCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 > feedbackData.length - visibleCards ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? feedbackData.length - visibleCards : prevIndex - 1
    );
  };

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        
        <div className="relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
            >
              {feedbackData.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="flex-shrink-0"
                  style={{ width: `${100/visibleCards}%` }}
                >
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <div className="flex justify-center mt-6 gap-2">
          {feedbackData.slice(0, feedbackData.length - visibleCards + 1).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}