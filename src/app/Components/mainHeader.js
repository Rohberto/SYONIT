import React from 'react';
import Profile from "../Assets/profile.png";
import Hamburger from "../Assets/hamburger.png";
import Image from 'next/image';

const Header = () => {
  return (
    <div className="main_header">
        <div className='header_links'>
        <div className='profile_menu'>
            <Image src={Profile} alt='profile'/>
        </div>

        <h1>SYONit!</h1>

        <div className='hamburger_menu'>
            <Image src={Hamburger} alt='hamburger'/>
        </div>
        </div>    
    <div className="headerLine"></div>
  </div>
  )
}

export default Header;
