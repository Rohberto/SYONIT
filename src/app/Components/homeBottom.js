import React from 'react';
import Link from 'next/link';

const Bottom = () => {
  return (
    <div className='home_bottom'>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
      <Link href={"/invite"} className='onboarding_link onboarding_link_login onboarding_left'>Invite Friends</Link>
      <Link href={"/"} className='onboarding_link onboarding_link_sign onboarding_right'>Join Next Game</Link>
      <div className='button_circle'></div>
    </div>
    </div>
      <div className="bottomContainer"></div>
    </div>
  )
}

export default Bottom;
