// lib/audioContext.js
let audioContext = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null; // Avoid SSR issues
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume(); // Resume if suspended (e.g., after page focus loss)
  }
  return ctx;
}

// Optional: Preload a sound buffer or create a reusable source
export function playSound(buffer) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}