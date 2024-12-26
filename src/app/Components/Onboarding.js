"use client"
import React from 'react';
import "swiper/css";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Autoplay} from "swiper/modules";
import Image from 'next/image';
import Icon1 from "../Assets/icon1.png";
import Icon2 from "../Assets/icon2.png";
import Header from './Header';
import Bottom from './Bottom';

const OnboardingScreen = () => {
  return (
    <div className="container">
      {/* Header */}
    <Header/>
      
      {/* slider  Content */}
   <Swiper 
   grabCursor={true}
   centeredSlides={true}
   slidesPerView={1}
   spaceBetween={20}
   autoplay = {{
    delay: 3000,
    disableOnInteraction: false
   }
  }
   pagination={{clickable: true, type: "bullets"}}
   modules={[Pagination, Autoplay]}
  className='swiper_container' >
    <SwiperSlide>
      <div className='onboarding_slide'>
      <div className='onboaring_screen'>
      <img src='/stadium.png' alt='stadium'/>
      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='onboarding_slide'>
      <div className='onboaring_screen'>
        <img src='/stadium.png' alt='stadium'/>
      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a prized based gameplay.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='onboarding_slide'>
      <div className='onboaring_screen'>
      <img src='/stadium.png' alt='stadium'/>
      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>combines competition, strategy and rewards.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='onboarding_slide'>
      <div className='onboaring_screen'>
      <img src='/stadium.png' alt='stadium'/>
      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a unique concept game of binary decision making.</span></p>
      </div>
    </SwiperSlide>
   
   </Swiper>
      
      {/* Illustrations */}
      <div className="illustrations">
        <div className="illustration">
         <Image src={Icon2} alt='walking logo'/>
        </div>
        <div className="illustration">
        <Image src={Icon1} alt='walking logo'/>
        </div>
      </div>
      
      <Bottom/>
   
    </div>
  );
};

export default OnboardingScreen;
