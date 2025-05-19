"use client";
import { useEffect, useState, useRef } from "react";
import "./onboarding.css";
import "./ProgressBar.css";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getAudioContext, playSound } from "@/app/libs/audioContext";
import ProgressBar from "./progressBar";

const Onboarding = () => {
  const router = useRouter();
  const [audioBuffer, setAudioBuffer] = useState(null);
  const buttonRef = useRef(null);
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

  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const loadSound = async () => {
      try {
        const response = await fetch("/Sounds/SYON.mp3");
        if (!response.ok) throw new Error('Failed to fetch audio');
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
        setAudioBuffer(decodedBuffer);
      } catch (err) {
        console.error('Error loading audio:', err);
      }
    };

    loadSound();
  }, []);

  const handlePlayClick = () => {
    if (audioBuffer) {
      playSound(audioBuffer, '/Sounds/SYON.mp3');
      router.push("/intro");
    } else {
      router.push("/Home");
    }
  };



  return (
    <div className="new_onboarding_container">
      <div className="onboarding_primary_text">
        <h1>SY <div className="flip-container"><div className="flip-card"><div className="flip-card-front"><img src="/syonit_icon.png" alt="syonit logo" /></div> 
        <div className="flip-card-back">
          <img src='/dark_musketeer.png' alt='musketeeers' className="coin_musketeer"/>
        </div>
        </div></div>Nit!</h1>
      </div>

     <div className="progress-container">
     {!isComplete &&  <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>}
      {isComplete && (
       <div className="new_onboarding_bottom_content">
               <img src='/main_musketeer.svg' alt='musketeeers' className="onboarding_musketeer"/>
               <div className="new_onboarding_bottom_text">
                 <p className="think_differently">THINK <span className="flipped">D</span>IFFERENTLY</p>
               </div>
               <div className="play_container">
                 <button id="game-button" ref={buttonRef} onClick={() => handlePlayClick()}>Let's Play</button>
               </div>
             </div>
      )}
    </div>
    </div>
  );
}

export default Onboarding;

