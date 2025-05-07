import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./button.css";
import { getAudioContext, playSound } from '../../libs/audioContext';
import { useUser } from '../../Context/userContext';

const PrizeButton = ({Modal}) => {
const [lines, setLines] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const {setUser, setPrize} = useUser();

  const logOut = () => {
    setUser(false);
    setPrize(null);
    localStorage.setItem("user", false);  
    localStorage.removeItem("prize");
  }

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
    <div className="buttonsContainer">
    <button
      className="game_stroke_links game_single_button"
    onClick={() => {
           if (audioBuffer) {
              playSound(audioBuffer, '/Sounds/click_sound.wav');
            }
       logOut()}}
    >
      Logout
    </button>
    <button
      className="game_stroke_links game_single_button"
      onClick={() => {
           if (audioBuffer) {
              playSound(audioBuffer, '/Sounds/click_sound.wav');
            }
       Modal(true)}}
    >
    Change My Prize
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

export default PrizeButton;