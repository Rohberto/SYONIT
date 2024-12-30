import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Bottom = ({handleJoinGame, isLoading, gameplaySoundRef}) => {
  const router = useRouter();
  
  return (
    <div className='home_bottom mainBottomContainer'>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
      <Link href={"/invite"} className='onboarding_link onboarding_link_login onboarding_left'>Invite Friends</Link>
      <button className='onboarding_link onboarding_button onboarding_link_sign onboarding_right'  onClick={() => {router.push("/game");
        gameplaySoundRef.current.play();
      }}>Join Next Game</button>
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
