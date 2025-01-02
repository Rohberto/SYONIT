import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Bottom = ({handleJoinGame, isLoading, gameplaySoundRef}) => {
  const router = useRouter();
  const circle = useRef();
    useEffect(() => {
      for (let i = 0; i < 60; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.transform = `rotate(${i * 6}deg) translateX(-50%)`;
        circle.current.appendChild(line);
      }
    }, []);
  return (
    <div className='home_buttons_container'>
    <div className='buttonsContainer'>
      <Link href={"/invite"} className='home_stroke_links onboarding_link_login onboarding_left'>Invite Friends</Link>
      <button className='home_stroke_links onboarding_button onboarding_link_sign onboarding_right'  onClick={() => {router.push("/game");
        gameplaySoundRef.current.play();
      }}>Join Next Game</button>
      <div className='button_circle'>
      <div className="lines" id="lines" ref={circle}></div>
   </div>
    </div>
    </div>
  )
}

export default Bottom;
