"use client"
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAudioContext, playSound } from '../libs/audioContext';

const Bottom = () => {
  const router = useRouter();
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Example: Load a sound file and play it on button click
    const loadAndPlaySound = async () => {
      const response = await fetch('/Sounds/click_sound.wav');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      const button = document.getElementById('game_sign_up');
      const button1 = document.getElementById('game_next_game');
      button.addEventListener('click', () => playSound(audioBuffer));
      button1.addEventListener('click', () => playSound(audioBuffer));
    };

    loadAndPlaySound();
  }, []);
  return (
    <div className='home_buttons_container'>
          <button id='game_sign_up'  className='home_stroke_links' onClick={() => {router.push("/signup");
      }}>Sign Up</button>
    <button id='game_next_game' className='home_stroke_links' onClick={() => {router.push("/login");
      }}>Play Next Game</button>
  
 
    </div>
  )
}

export default Bottom;
