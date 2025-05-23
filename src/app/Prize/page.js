"use client"
import React, { useState, useEffect } from 'react';
import Header from '../Components/MainHeader/mainHeader';
import "./prize.css";
import { useRouter } from 'next/navigation';
import { getAudioContext, playSound } from '../libs/audioContext';
import { useUser } from '../Context/userContext';
// Polyfill Fetch for older Safari (<10.1)
import 'whatwg-fetch';

const Prize = () => {
  const router = useRouter();
  const [actualPrize, setActualPrize] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [clickBuffer, setClickBuffer] = useState(null);
  const [confirmBuffer, setConfirmBuffer] = useState(null);
  const {setPrize, prizes, user} = useUser();


useEffect(() => {
  if(!user) {
    router.replace("/signup")
  }
})




  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      console.warn('Web Audio API not supported');
      return;
    }

    const loadSounds = async () => {
      try {
        const clickResponse = await fetch('/Sounds/coin_drop.mp3');
        if (!clickResponse.ok) throw new Error('Failed to fetch coin_drop.mp3');
        const clickArrayBuffer = await clickResponse.arrayBuffer();
        const clickAudioBuffer = await ctx.decodeAudioData(clickArrayBuffer);
        setClickBuffer(clickAudioBuffer);

        const confirmResponse = await fetch('/Sounds/click_sound.wav');
        if (!confirmResponse.ok) throw new Error('Failed to fetch click_sound.wav');
        const confirmArrayBuffer = await confirmResponse.arrayBuffer();
        const confirmAudioBuffer = await ctx.decodeAudioData(confirmArrayBuffer);
        setConfirmBuffer(confirmAudioBuffer);
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadSounds();
  }, []);

  const handlePrizeClick = (id) => {
    if (clickBuffer) {
      playSound(confirmBuffer, '/Sounds/click_sound.wav'); // Fallback URL
    }
    setPrize(id);
    localStorage.setItem("prize", id);
    setActualPrize(id);
    setModalOpen(true);
  };

  const handleClose = () => {
    if (confirmBuffer) {
      playSound(confirmBuffer, '/Sounds/click_sound.wav'); // Fallback URL
    }
    setModalOpen(false);
    setActualPrize(0); // Reset to 0 (number, not string)
  };

  const handleConfirm = () => {
    if (confirmBuffer) {
      playSound(clickBuffer, '/Sounds/coin_drop.mp3'); // Fallback URL
    }
    router.push("/Home");
    setModalOpen(false);
    setActualPrize(0); // Reset to 0
  };

  return (
    <div className='prize_container'>
      <Header />
      <div className='Home_screen'>
        <h1>You have To Select A Prize To Play.</h1>

        <div className='prize_grid'>
          {prizes.map((item) => (
            <div
              className={`prizes_container ${item.id === actualPrize ? "selected_prize" : ""}`}
              key={item.id}
              onClick={() => handlePrizeClick(item.id)}
            >
              <div className='prize_img_container'>
                <img src={item.prize} alt='prize Image' />
              </div>
              <p>Redeem with {item.points} points </p>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Are you sure you want to play for this prize?</h2>
              <div className="modal-buttons">
                <button className="no-button" onClick={handleClose}>
                  No
                </button>
                <button className="continue-button" onClick={handleConfirm}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prize;