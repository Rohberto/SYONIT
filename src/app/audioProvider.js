// app/AudioProvider.js
'use client';

import { useEffect } from 'react';
import { unlockAudioContext } from './libs/audioContext'; // Adjust path

export default function AudioProvider({ children }) {
  useEffect(() => {
    const handleUserInteraction = () => {
      unlockAudioContext();
      window.removeEventListener('click', handleUserInteraction); // Clean up
    };
    window.addEventListener('click', handleUserInteraction);
    return () => window.removeEventListener('click', handleUserInteraction);
  }, []);

  return <>{children}</>;
}