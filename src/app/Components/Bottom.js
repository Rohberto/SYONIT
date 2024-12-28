import React from 'react';
import Link from 'next/link';

const Bottom = () => {
  return (
    <div className='mainBottomContainer'>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
    <Link href={"/login"}>
            <span className="onboarding_link onboarding_link_login">Login</span>
          </Link>
          <Link href={"/signup"}>
            <span className="onboarding_link onboarding_link_sign">Signup</span>
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
