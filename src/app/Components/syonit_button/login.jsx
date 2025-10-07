import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./button.css";
import { getAudioContext, playSound } from '../../libs/audioContext';
import Glass from '../GlassyButton/Glass';

const Button = () => {
const [lines, setLines] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);

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
    <div className="buttonsContainer glassContainer">
    <button
      className="game_stroke_links"
      onClick={() => {
           if (audioBuffer) {
              playSound(audioBuffer, '/Sounds/click_sound.wav');
            }
        router.back()}}
    >
        BACK
    </button>
    <button
      className="game_stroke_links"
      onClick={() => {
           if (audioBuffer) {
              playSound(audioBuffer, '/Sounds/click_sound.wav');
            }
        router.push("/Home")}}
    >
        LOGIN
    </button>
    <div className="button-circle glassBtn">
      
    </div>
    <Glass />
  </div>
  )
}

export default Button;