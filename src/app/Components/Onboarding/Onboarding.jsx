"use client"
import { useEffect, useState, useRef } from "react";
import "./onboarding.css";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getAudioContext, playSound } from "@/app/libs/audioContext";

// Polyfill Fetch for older Safari (<10.1)
import 'whatwg-fetch';

const Onboarding = () => {
  const router = useRouter();
  const [audioBuffer, setAudioBuffer] = useState(null); // Store the loaded sound
  const [audioUnlocked, setAudioUnlocked] = useState(false); // Track AudioContext state
  const buttonRef = useRef(null); // Ref for the button to manage listener

  // Load sound and set up listener
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      console.warn('Web Audio API not supported in this browser');
      // Fallback could be added here if needed
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

    // Ensure AudioContext is running after user interaction
    const handleUnlock = () => {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          setAudioUnlocked(true);
          console.log('AudioContext resumed');
        }).catch(err => console.error('Resume failed:', err));
      } else if (ctx.state === 'running') {
        setAudioUnlocked(true);
      }
    };

    window.addEventListener('click', handleUnlock, { once: true });
    return () => window.removeEventListener('click', handleUnlock);
  }, []);

  // Handle play button click
  const handlePlayClick = () => {
    if (audioBuffer) {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'running') {
        playSound(audioBuffer, '/Sounds/SYON.mp3');
        router.push("/Home");
      } else {
        alert('AudioContext not running yet - click again after unlocking');
      }
    } else {
      console.warn('Audio not loaded yet');
      router.push("/Home"); // Navigate anyway if audio fails
    }
  };

  // Attach listener to button ref
  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('click', handlePlayClick);
      return () => button.removeEventListener('click', handlePlayClick);
    }
  }, [audioBuffer, audioUnlocked]); // Re-run if buffer or unlock state changes

  return (
    <div className="new_onboarding_container">
      <div className="onboarding_primary_text">
        <p>A mind game tourna-musement </p>
        <h1>SY <div className="flip-container"><div className="flip-card"><div className="flip-card-front"><img src="/syonit_icon.png" alt="syonit logo" /></div> 
        <div className="flip-card-back">
          <img src='/dark_musketeer.png' alt='musketeeers' className="coin_musketeer"/>
        </div>
        </div></div>Nit!</h1>
      </div>

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
    </div>
  );
}

export default Onboarding;