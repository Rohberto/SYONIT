"use client";
import React, {useEffect} from 'react';
import Bottom from '../Components/loginBottom';
import Header from '../Components/MainHeader/mainHeader';
import { FcGoogle } from "react-icons/fc";
import Points from '../Components/loginPoints';
import { useRouter } from 'next/navigation';
import { FaApple } from 'react-icons/fa';
import { getAudioContext, playSound } from '../libs/audioContext';
import { useUser } from '../Context/userContext';
import "./login.css";
const LoginScreen = () => {
  return (
    <div className="container">
      <Header/>

      {/* Input Fields */}
      <div className="input-container">
        <div className="input-field">
          <label>Email:</label>
          <input type="email" placeholder="Enter your emails" />
        </div>
        <div className="input-field">
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
      </div>

      {/* Sign in with Apple Button */}
      <button className="apple-button">
        <span className="apple-icon"><FcGoogle/> </span> Sign in with Google
      </button>

     <Bottom/>
    </div>
  );
};

const SecondLoginScreen = () => {
  const {user, setUser} = useUser();
  const router = useRouter();

  const handleSubmit = () => {
    setUser(true);
    localStorage.setItem("user", true)
    router.push("/Prize");
  }
    useEffect(() => {
      const ctx = getAudioContext();
      if (!ctx) return;
  
      // Example: Load a sound file and play it on button click
      const loadAndPlaySound = async () => {
        const response = await fetch('/Sounds/click_sound.wav');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        
        const button = document.getElementById('login_cancel');
        const button1 = document.getElementById('login_enter');
        button.addEventListener('click', () => playSound(audioBuffer));
        button1.addEventListener('click', () => playSound(audioBuffer));
      };
  
      loadAndPlaySound();
    }, []);
  return (
    <div className="login-console">
    <Header/>
<div className="login-container">
  {/* Header */}


  {/* Round Info */}
  <div className="round-info">
    <p>Next Game:</p>
    <h2>9:43</h2>
  </div>

  {/* Player and Points */}
<Points/>

<div className="login_blank_screen">

<div className="login-input-field">
          <label>Email:</label>
          <input type="email"  />
        </div>

        <div className="login-input-field">
          <label>Password:</label>
          <input type="password"  />
        </div>

        <button className="login-apple-button">
        <span className="apple-icon"><FcGoogle/> </span> Sign in with Google
      </button>  
       <button className="login-apple-button">
              <span className="apple-icon"><FaApple/> </span> Sign in with Apple
            </button>
</div>

</div>

<div className='sign_buttons_container'>
          <button id='login_cancel' className='sign_stroke_links' onClick={() => {router.push("/Home");
      }}>Cancel</button>
    <button id='login_enter' className='sign_stroke_links' onClick={() => {handleSubmit()}}>Enter</button>
  </div>

</div>
  )
}

export default SecondLoginScreen;

