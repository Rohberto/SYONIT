// app/AudioProvider.js
'use client';

import { useEffect, useState } from 'react';
import { unlockAudioContext } from './libs/audioContext'; // Adjust path

export default function AudioProvider({ children }) {
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => {
      try {
        const ctx = unlockAudioContext();
        if (ctx) {
          // Ensure context is running (older Safari might suspend it)
          if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
              setAudioUnlocked(true);
              window.removeEventListener('click', handleUserInteraction);
            }).catch((err) => console.error('Resume failed:', err));
          } else if (ctx.state === 'running') {
            setAudioUnlocked(true);
            window.removeEventListener('click', handleUserInteraction);
          }
        }
      } catch (err) {
        console.error('Audio unlock failed:', err);
      }
    };

    window.addEventListener('click', handleUserInteraction);
    return () => window.removeEventListener('click', handleUserInteraction);
  }, []);

  // Optional: Show a message if audio isn't unlocked yet
  if (!audioUnlocked) {
    return (
      <>
        {children}
      </>
    );
  }

  return <>{children}</>;
}