"use client"
import React from 'react';
import Header from '../Components/mainHeader';
import "./page.css";
import Points from '../Components/points';
import "swiper/css";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from "swiper/modules";

const Home = () => {
  const labels = ['current game', 'Leaderboard', 'Prizes', 'History'];
  return (
    <div className='home_container'>
        <Header/>
        <Points/>

        {
          /*screen */
        }
            {/* slider  Content */}
   <Swiper 
   grabCursor={true}
   centeredSlides={true}
   slidesPerView={1}
   spaceBetween={20}
   pagination={{
    clickable: true,
    renderBullet: (index, className) => {
      return `
        <div class="custom-pagination-bullet">
          <span class="bullet-label">${labels[index]}</span>
          <span class="swiper-pagination-bullet"></span>
        </div>
      `;
    },
  }}
   modules={[Pagination]}
  className='swiper_container' >
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>
        <div class="current_game_header">CURRENT GAME</div>
        <div class="current_game_info_buttons">
          <p>N.O.P: 4000</p>
          <p>OPP 3</p>
          <p>Round 4</p>
        </div>
      
      </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>

      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>

      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>

      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
   
   </Swiper>
    </div>
  )
}

export default Home
