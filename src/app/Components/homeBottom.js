"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAudioContext, playSound } from '../libs/audioContext';
import 'whatwg-fetch';
import { useUser } from '../Context/userContext';

const Bottom = () => {
  const router = useRouter();
  const [audioBuffer, setAudioBuffer] = useState(null);
  const signUpButtonRef = useRef(null);
  const nextGameButtonRef = useRef(null);
  const {user} = useUser();

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

  const handleSignUpClick = () => {
    if (audioBuffer) {
      playSound(audioBuffer, '/Sounds/click_sound.wav');
    }
    router.push("/signup");
  };

  const handleNextGameClick = () => {
    if (audioBuffer) {
      playSound(audioBuffer, '/Sounds/click_sound.wav');
    }
    router.push(`${user ? "/Prize" : "login"}`);
  };

  useEffect(() => {
    const signUpButton = signUpButtonRef.current;
    const nextGameButton = nextGameButtonRef.current;

    if (signUpButton) {
      signUpButton.addEventListener('click', handleSignUpClick);
    }
    if (nextGameButton) {
      nextGameButton.addEventListener('click', handleNextGameClick);
    }

    return () => {
      if (signUpButton) {
        signUpButton.removeEventListener('click', handleSignUpClick);
      }
      if (nextGameButton) {
        nextGameButton.removeEventListener('click', handleNextGameClick);
      }
    };
  }, [audioBuffer]);

  return (
    <div className='home_buttons_container'>
      <button
        id='game_sign_up'
        ref={signUpButtonRef}
        className='home_stroke_links'
      >
        Sign Up
      </button>
      <button
        id='game_next_game'
        ref={nextGameButtonRef}
        className='home_stroke_links'
      >
        Play Next Game
      </button>
    </div>
  );
}

export default Bottom;