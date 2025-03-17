"use client"
import React, { useState, useEffect} from 'react';
import Header from '../Components/MainHeader/mainHeader';
import Points from '../Components/points';
import "swiper/css";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from "swiper/modules";
import Round from '../Components/gameRound/gameRound';
import Bottom from '../Components/homeBottom';
import "./prize.css";
import { useRouter } from 'next/navigation';
import { getAudioContext, playSound } from '../libs/audioContext';


const Prize = () => {
  const router = useRouter();
  const [actualPrize, setActualPrize] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [clickBuffer, setClickBuffer] = useState(null);
  const [confirmBuffer, setConfirmBuffer] = useState(null);
  
  const prize = [
    {
      id: 1,
      prize: "/camera.jpg",
      points: 30
    },
    {
      id: 2,
      prize: "/car.jpg",
      points: 20
    },
    {
      id: 3,
      prize: "/laptop.jpg",
      points: 25
    }, 
    {
      id: 4,
      prize: "/phone.jpg",
      points: 15
    }, 
    {
      id: 5,
      prize: "/television.jpg",
      points: 30
    }
  ]
  const onClose = () => {
    setModalOpen(false);
    setActualPrize("");
  }

  const onConfirm = () => {
    router.push("/game");
    setModalOpen(false);
    setActualPrize("");
  }

 useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Example: Load a sound file and play it on button click
    const loadAndPlaySound = async () => {

      try{
      
      const response = await fetch('/Sounds/coin_drop.mp3');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      setClickBuffer(audioBuffer);

      const confirmResponse = await fetch('/Sounds/click_sound.wav');
        const confirmArrayBuffer = await confirmResponse.arrayBuffer();
        const confirmAudioBuffer = await ctx.decodeAudioData(confirmArrayBuffer);
        setConfirmBuffer(confirmAudioBuffer);
      }  catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadAndPlaySound();
  }, []);

  const handlePrizeClick = () => {
    if (clickBuffer) {
      playSound(clickBuffer); // Same sound for every prize
    }
   
  };
  const handleModalClick = () => {
    if (confirmBuffer) {
      playSound(confirmBuffer); // Same sound for every prize
    }
   
  };

  return (
    <div className='prize_container'>
      <Header/>
      <div className='Home_screen'>
        <h1>Select Your Prize</h1>

        <div className='prize_grid'>
          {
            prize && 
            prize.map((item, key) => (
            <div className={`prizes_container ${item.id === actualPrize ? "selected_prize" : undefined}`} key={key} onClick={() => {setActualPrize(item.id); setModalOpen(true); handlePrizeClick()}}>
              <div className='prize_img_container'>
                <img src={item.prize} alt='prize Image'/>
              </div>
              <p>{item.points}</p>
            </div>
            ))
          }
        </div>

{
  isModalOpen && (
    <div className="modal-overlay">
    <div className="modal">
      <h2>Are you sure you want to play for this prize?</h2>
      <div className="modal-buttons">
        <button className="no-button" onClick={() => {onClose(); handleModalClick()}}>
          No
        </button>
        <button className="continue-button" onClick={() => {onConfirm(); handleModalClick()}}>
          Continue
        </button>
      </div>
    </div>
  </div>
  )
}

      </div>
    </div>
  )
}

export default Prize;