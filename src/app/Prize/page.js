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
  return (
    <div className='prize_container'>
      <Header/>
      <div className='Home_screen'>
        <h1>Select Prizes</h1>

        <div className='prize_list'>
          {
            prize && 
            prize.map((item, key) => (
              <button key={key}>
                <span>{item.prize}</span>
                <span>{item.points}</span>
              </button>
            ))
          }
        </div>
      </div>


      <div className='prize_buttons'>
        <button onClick={() => {router.push("/game");
      }} >SELECT PRIZE</button>
        </div>
    </div>
  )
}

export default Prize;