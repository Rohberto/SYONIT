import React from 'react';
import Link from 'next/link';

const Bottom = () => {
  return (
    <>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
      <Link href={"/login"} className='onboarding_link onboarding_link_login'>Login</Link>
      <Link href={"/signup"} className='onboarding_link onboarding_link_sign'>Sign Up</Link>
      <div className='button_circle'></div>
    </div>
    </div>
      <div className="bottomContainer"></div>
    </>
  )
}

export default Bottom;
