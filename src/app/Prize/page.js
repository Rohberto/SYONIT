"use client"
import React, { useState} from 'react';
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

const Prize = () => {
  const router = useRouter();
  const [actualPrize, setActualPrize] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const prize = [
    {
      prize: "car",
      points: 30
    },
    {
      prize: "camera",
      points: 20
    },
    {
      prize: "phone",
      points: 25
    }, {
      prize: "television",
      points: 15
    }, 
    {
      prize: "laptop",
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
  return (
    <div className='prize_container'>
      <Header/>
      <div className='Home_screen'>
        <h1>Select Prizes</h1>

        <div className='prize_list'>
          {
            prize && 
            prize.map((item, key) => (
              <button key={key} onClick={() => {setActualPrize(item.prize) 
                setModalOpen(true);
              }} className={actualPrize === item.prize && "selected_prize"}>
                <span>{item.prize}</span>
                <span>{item.points}</span>
              </button>
            ))
          }
        </div>

{
  isModalOpen && (
    <div className="modal-overlay">
    <div className="modal">
      <h2>Are you sure you want to play for this prize?</h2>
      <div className="modal-buttons">
        <button className="no-button" onClick={onClose}>
          No
        </button>
        <button className="continue-button" onClick={onConfirm}>
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