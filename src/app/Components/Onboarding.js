"use client"
import React, {useEffect, useRef} from 'react';
import "swiper/css";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Autoplay} from "swiper/modules";
import Image from 'next/image';
import Icon1 from "../Assets/icon1.png";
import Icon2 from "../Assets/icon2.png";
import Header from './Header';
import Bottom from './Bottom';
import Link from 'next/link';

const OnboardingScreen = () => {
  const circle = useRef();
  useEffect(() => {
    for (let i = 0; i < 60; i++) {
      const line = document.createElement('div');
      line.classList.add('line');
      line.style.transform = `rotate(${i * 6}deg) translateX(-50%)`;
      circle.current.appendChild(line);
    }
  }, []);
  return (
    <div className="container">
      {/* Header */}
    <Header/>
    <div className='onboarding_about'>
        <h4>Syonit is a mind Game where thinking differently is the key to winning.</h4>
        <h4>It Features Elimination Rounds.</h4>
        <h4>Outcomes are determined by your own decision.</h4>
        <h4>The Last Player Standing is Crowned the <span>$</span>YO<span>&#8358;</span>AIR<span>&#8364;</span></h4>
    </div>
      
{/* ILLUSTRATIONS */}
<div className='illustrations_container'>
  <img src='/syonit-logo.svg' alt='musketeeers'/>
</div>




      <div className='onboarding_buttons_container'>
    <div className='buttonsContainer'>
    <Link href={"/login"}>
            <span className="stroke_links onboarding_link_login">Login</span>
          </Link>
          <Link href={"/signup"}>
            <span className="stroke_links onboarding_link_sign">Signup</span>
          </Link>
      <div className='button_circle' >
      <div class="lines" id="lines" ref={circle}></div>
      </div>
    </div>
    </div>
   
    </div>
  );
};

export default OnboardingScreen;
