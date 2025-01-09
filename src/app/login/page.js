"use client";
import React from 'react';
import Bottom from '../Components/loginBottom';
import Header from '../Components/mainHeader';
import { FcGoogle } from "react-icons/fc";
import Points from '../Components/loginPoints';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  return (
    <div className="login-console">
    <Header/>
<div className="login-container">
  {/* Header */}


  {/* Round Info */}
  <div className="round-info">
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
</div>

</div>

<div className='sign_buttons_container'>
          <button  className='sign_stroke_links' onClick={() => {router.push("/Home");
      }}>Cancel</button>
    <button className='sign_stroke_links' onClick={() => {router.push("/game");
      }}>Enter</button>
  </div>

</div>
  )
}

export default SecondLoginScreen;

