import { useState, useEffect } from 'react';
import "./ImagesSlider.css";

const ImageSlider = ({ slides, prize }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-swipe every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides.length]);
console.log(prize);
  return (
    <div className={slides[currentIndex].id === prize ? "slider-containerr active" : "slider-containerr" }>
        {
         slides[currentIndex].id === prize && (
            <h1>Selected Prize</h1>
         )   
        }
      {/* Image Display */}
      <div className="image-wrapper">
        <img
          src={slides[currentIndex].prize}
          alt={slides[currentIndex].points}
          className="slider-image"
        />
      </div>

      {/* Text Description */}
      <div className='sliding-content'>
        <p>Points to go: {slides[currentIndex].points}</p>
      </div>
    </div>
  );
};

export default ImageSlider;