"use client"
import React, {useEffect, useRef, useState} from 'react';
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
import DropdownForm from './Login_Components/dropdownForm';
import {useRouter} from 'next/navigation';

const OnboardingScreen = () => {
  const [drop, setDrop] = useState(false);
  const [auth_state, setAuthState] = useState("login")
  const circle = useRef();
  const Router = useRouter();
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
    <DropdownForm drop={drop} auth_state={auth_state}/>
    <div className={drop ? "about_no_display" : 'onboarding_about'}>
        <h4>Syonit! is a fast paced, multi-player mind game where players must think critically and make lightning-quick Yes or No decisions. Thinking differently is the secret to winning.</h4>
        <p>The Last Player Standing is Crowned the <span>$</span>YO<span>&#8358;</span>AIR<span>&#8364;</span></p>
    </div>
      
{/* ILLUSTRATIONS */}
<div className={drop ? "no_illustration" : 'illustrations_container'}>
  <img src='/musketers.svg' alt='musketeeers'/>
</div>




      <div className='onboarding_buttons_container'>
    <div className='buttonsContainer'>
      {!drop && (
        <>
    <button  onClick={() => {setDrop(drop => true); auth_state !== "login" && setAuthState("login")}} className='onboarding_link_button'>
            <span className="stroke_links onboarding_link_login">Login</span>
          </button>
          <button onClick={() => {setDrop(true); auth_state !== "sign_up" && setAuthState("sign_up")}} className='onboarding_link_button'>
            <span className="stroke_links onboarding_link_sign">Signup</span>
          </button> 
          </>
      )
    }
    {
      drop && auth_state === "login" && (
        <>
        <button  onClick={() => {setDrop(false)}} className='onboarding_link_button'>
                <span className="stroke_links onboarding_link_login">Close</span>
              </button>
              <button onClick={() => {Router.push('/Home')}} className='onboarding_link_button'>
                <span className="stroke_links onboarding_link_sign">Login</span>
              </button>
              </>
      )
    }
    {
      drop && auth_state === "sign_up" && (
        <>
        <button  onClick={() => {setDrop(false)}} className='onboarding_link_button'>
                <span className="stroke_links onboarding_link_login">Close</span>
              </button>
              <button onClick={() => {Router.push('/Home')}} className='onboarding_link_button'>
                <span className="stroke_links onboarding_link_sign">Sign Up</span>
              </button>
              </>
      )
    }
      <div className='button_circle' >
      <div className="lines" id="lines" ref={circle}></div>
      </div>
    </div>
    </div>
   
    </div>
  );
};

export default OnboardingScreen;
