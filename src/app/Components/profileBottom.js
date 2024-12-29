"use client";
import React from 'react';
import Link from 'next/link';

const Bottom = () => {
  return (
    <div className='mainBottomContainer'>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
    <Link href={"/Home"}>
            <span className="onboarding_link onboarding_link_login">Finish</span>
          </Link>
          <Link href={"/signup"}>
            <span className="onboarding_link onboarding_link_sign">Back</span>
          </Link>
      <div className='button_circle'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Bottom;
