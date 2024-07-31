import React, { useEffect, useState } from 'react';
import { dummyTestimonies, Testimony } from '../constants';

const TestimonyCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalTestimonies = dummyTestimonies.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonies);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalTestimonies]);


  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      <div className="relative h-32 md:h-40 overflow-hidden mt-20 rounded-lg">
        {dummyTestimonies.map((testimony: Testimony, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            data-carousel-item={index === currentIndex}
          >
            <div className=" shadow-lg rounded-lg p-4 m-2 mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <p className="text-lg text-neutral-500 ">{testimony.name}</p>
              <p className="text-gray-500">{testimony.testimony}</p>
            </div>
          </div>
        ))}
      </div>

      
      
    </div>
  );
};

export default TestimonyCarousel;
