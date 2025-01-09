import React from 'react';
import Profile from "../Assets/profile.png";
import Hamburger from "../Assets/hamburger.png";
import Image from 'next/image';

const Header = () => {
  return (
    <div className="main_header">
        <div className='header_links'>
         <h1>SYONit!</h1>

        <div className='hamburger_menu'>
            <Image src={Hamburger} alt='hamburger'/>
        </div>
        </div>    
  </div>
  )
}

export default Header;
