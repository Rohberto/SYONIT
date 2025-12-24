// app/page.js   (or .jsx if you prefer)
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import './banner.css';
import { getAudioContext, playSound } from '@/app/libs/audioContext';
import { useRouter } from 'next/navigation';
import SpotlightOverlay from '../Game_Assistant/SpotlightOverlay';
import { useOnboarding } from '@/app/Context/OnboardingContext';
import { OnboardingSteps } from '@/app/libs/onboardingSteps';
// GSAP
import { gsap } from 'gsap';

export default function Banner() {
  const router = useRouter();
  const buttonRef = useRef(null);
  const [audioBuffer, setAudioBuffer] = useState(null);

  // Load sound (unchanged)
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

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
  }, []);

  const handlePlayClick = () => {
    if (audioBuffer) {
      playSound(audioBuffer, '/Sounds/SYON.mp3');
      router.push("/about");
    }
  };

  // Simple GSAP animations (no ScrollTrigger)
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Title
    tl.from("h1", { y: 80, opacity: 0, duration: 1 });

    // Subtitle lines
    tl.from(".intro-subtitle", { y: 60, opacity: 0, duration: 1 }, "-=0.7");

    // Character image
    tl.from(".character-image", {
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.6)"
    }, "-=0.8");

    // Labels (CHANCE, CHOICE, STRATEGY)
    tl.from(".labels span", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.9");

    // Glass button container + button
    tl.from(".glasssContainer", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.7)"
    }, "-=0.8");

    // Button hover effect
    const btn = buttonRef.current;
    if (btn) {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { y: -10, scale: 1.05, duration: 0.4, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
      });
    }

    // Optional subtle floating for the character
    gsap.to(".character-image", {
      y: -15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, []);

    const { start } = useOnboarding();
  
   useEffect(() => {
      const seen = localStorage.getItem('syonit_onboarding_seen_welcome');
      if (!seen) {
        start(OnboardingSteps);
        localStorage.setItem('syonit_onboarding_seen_welcome', 'true');
      }
    }, []);

  return (
    <>
      <SpotlightOverlay />
    <div className="syonit-page">
      <header className="intro-header">
        <h1>SYONIT!</h1>
        <p className="intro-subtitle">
          Mind influentainment<br />
          Tournamusement
        </p>
      </header>

      <div className="character-image">
        <img src="/musketeers.png" alt="Chance, Choice, Strategy" className="characters" />
        <div className="labels">
          <span>CHANCE</span>
          <span>CHOICE</span>
          <span>STRATEGY</span>
        </div>
      </div>

      <div className="new_onboarding_bottom_content">
        <div className="play_container">
          <div className="glasssContainer">
            <button
              ref={buttonRef}
              onClick={handlePlayClick}
              className="glassBtn intro-btn"
              data-guide="onboarding-welcome"
            >
              Let's Get Started
            </button>

            {/* Your SVG filters stay exactly the same */}
            <svg style={{ display: "none" }}>
              <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
                <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
                <feDisplacementMap in="SourceGraphic" in2="blur" scale="77" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="btn-glass" primitiveUnits="objectBoundingBox">
                <feImage href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6e..." x="0" y="0" width="1" height="1" result="map"></feImage>
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur"></feGaussianBlur>
                <feDisplacementMap id="disp" in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}