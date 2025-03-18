// lib/audioContext.js
let audioContext = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null; // Avoid SSR issues

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    console.warn('Web Audio API not supported in this browser');
    return null; // Safari <6 or very old browsers
  }

  if (!audioContext || audioContext.state === 'closed') {
    try {
      audioContext = new AudioContext();
    } catch (err) {
      console.error('Failed to create AudioContext:', err);
      return null;
    }
  }
  return audioContext;
}

export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (!ctx) return null;

  if (ctx.state === 'suspended') {
    return ctx.resume()
      .then(() => {
        console.log('AudioContext resumed successfully');
        return ctx;
      })
      .catch(err => {
        console.error('Failed to resume AudioContext:', err);
        return ctx; // Return anyway, might still work
      });
  }
  return Promise.resolve(ctx); // Already running or closed
}

export function playSound(buffer, fallbackUrl = null) {
  const ctx = getAudioContext();
  if (ctx && buffer) {
    if (ctx.state === 'suspended') {
      return ctx.resume()
        .then(() => {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
          return source;
        })
        .catch(err => {
          console.error('Resume failed during play:', err);
        });
    } else {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      return source;
    }
  } else if (fallbackUrl) {
    // Fallback to HTML5 <audio> for browsers without Web Audio
    const audio = new Audio(fallbackUrl);
    audio.play().catch(err => console.error('Fallback audio failed:', err));
    return audio; // Return for potential control (e.g., pause)
  } else {
    console.warn('No AudioContext or fallback URL available');
    return null;
  }
}

// Utility to check Web Audio support
export function isWebAudioSupported() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return !!AudioContext;
}