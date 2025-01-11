"use client"
import React, { useEffect, useState } from 'react';
import Hamburger from "../../Assets/hamburger.png";
import Image from 'next/image';
import "./mainheader.css";

const Header = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect( () => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, [])
  return (
    <div className="main_header">
        <div className='header_links'>

          <div className='header_profile_image'>
            <img src='/user.png' alt='header profile image'/>
          </div>

        <div className='header_time_text'>
        <p>{time}</p>
        <h1>SYONit!</h1>
        </div>
        

        <div className='hamburger_menu'>
            <Image src={Hamburger} alt='hamburger'/>
        </div>
        </div>    
  </div>
  )
}

export default Header;
