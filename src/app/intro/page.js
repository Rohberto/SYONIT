"use client"
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import "./intro.css"
import Link from 'next/link';
import Button from '../Components/syonit_button/intro';

const IntroPage = () => {
  const lineRefs = useRef([]);
  const buttonRef = useRef(null);
const router = useRouter();
  useEffect(() => {
    // Animate each line from below to top with stagger
    gsap.fromTo(
      lineRefs.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
      }
    );

    // Animate the button after the text animation
    gsap.fromTo(
      buttonRef.current,
      {  opacity: 0 },
      {

        opacity: 1,
        duration: 0.8,
        delay: 1.2,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className="intro_container">
     
      <div className="onboarding_primary_text">
        <h1>SYONIT</h1>
      </div>

      <div className="text-container">
        <p ref={(el) => (lineRefs.current[0] = el)}>
          SYONIT is a fast paced, multiplayer mind-game
        </p>
        <p ref={(el) => (lineRefs.current[1] = el)}>
          where players must think critically and make
        </p>
        <p ref={(el) => (lineRefs.current[2] = el)}>
          lightning quick Yes or No decisions.
        </p>
        <p ref={(el) => (lineRefs.current[3] = el)}>
          Thinking differently is the secret to winning.
        </p>
        <Link ref={(el) => (lineRefs.current[4] = el)} href="/about" >
          How To Play
        </Link>
       <hr/>
      </div>
      {/*
      <button ref={buttonRef} className="continue-button" onClick={
            () => router.push("/Home")
        } style={{
          marginLeft: "auto",
          marginRight: "auto"
        }}>
        <FaArrowRight/>
      </button>
      */}

        <div className='bottom_button' ref={buttonRef}>
          <div className="new_intro_bottom_content">
           <div className="new_intro_bottom_text">
                 <p className="think_differently">THINK <span className="flipped">D</span>IFFERENTLY</p>
               </div>
               <img src='/musketeer.svg' alt='musketeeers' className="intro_musketeer"/>
               </div>
          <Button/>
          </div>
    </div>
  );
};

export default IntroPage;