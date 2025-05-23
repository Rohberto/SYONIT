import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./button.css";
import { getAudioContext, playSound } from '../../libs/audioContext';

const Button = ({handleSubmit}) => {
const [lines, setLines] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
const [clickBuffer, setClickBuffer] = useState(null);

useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      console.warn('Web Audio API not supported');
      return;
    }

    const loadSound = async () => {
      try {
        const response = await fetch('/Sounds/click_sound.wav');
        if (!response.ok) throw new Error('Failed to fetch click sound');
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
        setAudioBuffer(decodedBuffer);

         const clickResponse = await fetch('/Sounds/coin_drop.mp3');
        if (!clickResponse.ok) throw new Error('Failed to fetch coin_drop.mp3');
        const clickArrayBuffer = await clickResponse.arrayBuffer();
        const clickAudioBuffer = await ctx.decodeAudioData(clickArrayBuffer);
        setClickBuffer(clickAudioBuffer);
      } catch (err) {
        console.error('Error loading click sound:', err);
      }
    };

    loadSound();
  }, []);



const router = useRouter();
     useEffect(() => {
        const newLines = Array.from({ length: 60 }, (_, i) => ({ id: i, active: true }));
        setLines(newLines);
      }, []);
  return (
    <div className="buttonsContainer">
    <button
      className="game_stroke_links"
    onClick={() => {
           if (audioBuffer) {
              playSound(audioBuffer, '/Sounds/click_sound.wav');
            }
        router.back()}}
    >
      Cancel
    </button>
    <button
      className="game_stroke_links"
      onClick={() => {
           if (audioBuffer) {
               playSound(clickBuffer, '/Sounds/coin_drop.mp3'); // Fallback URL
            }
        handleSubmit()}}
    >
   Signup
    </button>
    <div className="button_circle">
      <div className="lines" id="lines">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`line ${line.active ? "active" : ""}`}
            style={{ transform: `rotate(${line.id * 6}deg) translateX(-50%)` }}
          ></div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Button;