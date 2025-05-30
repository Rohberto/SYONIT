"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./profile.css";
import { getAudioContext, playSound } from '../libs/audioContext';


export default function Welcome() {
  const [profileImage, setProfileImage] = useState(null);
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
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="profileContainer">
     
      <h1 className="profileHeader">SYONIT</h1>
      <h2 className="subheader">WELCOME SYONNAIRE JOHN!</h2>
      <div className="profile-container">
        <div className="profile-picture">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <div className="placeholder"></div>
          )}
        </div>
        <label htmlFor="image-upload" className="upload-label">
          UPDATE PROFILE PICTURE
          <hr/>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>
      <div className='bottom-button'>
      <button className="profile-button" onClick={() => {
        playSound(clickBuffer, '/Sounds/coin_drop.mp3');
        router.push("/Home")
        }}>LET'S GET STARTED</button>
    </div>
    </div>
  );
}