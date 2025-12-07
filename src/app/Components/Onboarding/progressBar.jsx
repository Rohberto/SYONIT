'use client';

import { useState, useEffect } from 'react';
import './ProgressBar.css';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // Adjust speed by changing this value (lower = faster)

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {isComplete && (
       <div className="new_onboarding_bottom_content">
               <img src='/main_musketeer.svg' alt='musketeeers' className="onboarding_musketeer"/>
               <div className="new_onboarding_bottom_text">
                 <p className="think_differently">THINK <span className="flipped">D</span>IFFERENTLY</p>
                 <p className="become_a_syonaire">You Can Become A Syonaire</p>
               </div>
               <div className="play_container">
                 <button id="game-button" ref={buttonRef}><FaPlay/></button>
               </div>
             </div>
      )}
    </div>
  );
}