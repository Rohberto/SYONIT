import React from 'react';
import Link from 'next/link';

const Bottom = () => {
  return (
    <>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
    <Link href={"/"}>
            <span className="onboarding_link onboarding_link_login">Login</span>
          </Link>
          <Link href={"/"}>
            <span className="onboarding_link onboarding_link_sign">Back</span>
          </Link>
      <div className='button_circle'></div>
    </div>
    </div>
      <div className="bottomContainer"></div>
    </>
  )
}

export default Bottom;
