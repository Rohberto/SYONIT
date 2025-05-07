import { useState, useEffect } from 'react';
import "./quoteSlider.css";

const QuoteSlider = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
        { id: 1, image: "/quote.jpg", points: 30 },
        { id: 2, image: "/quote1.jpg", points: 20 },
        { id: 3, image: "/quote2.jpg", points: 25 }
      ];
  // Auto-swipe every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides.length]);
  return (
    <div className="slider-container">
       
      {/* Image Display */}
      <div className="image-wrapper">
        <img
          src={slides[currentIndex].image}
          alt={slides[currentIndex].image}
          className="slider-image"
        />
      </div>
    </div>
  );
};

export default QuoteSlider;