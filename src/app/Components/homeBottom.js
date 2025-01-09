import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Bottom = () => {
  const router = useRouter();

  return (
    <div className='home_buttons_container'>
          <button  className='home_stroke_links' onClick={() => {router.push("/signup");
      }}>Sign Up</button>
    <button className='home_stroke_links' onClick={() => {router.push("/login");
      }}>Play Next Game</button>
  
 
    </div>
  )
}

export default Bottom;
