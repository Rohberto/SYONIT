"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/mainHeader';
import "./login.css";
import { FcGoogle } from "react-icons/fc";

const LoginScreen = () => {
  const router = useRouter();
  return (
    <div className="container">
      <Header/>

      {/* Input Fields */}
      <div className="input-container">
        <div className="input-field">
          <label>First Name:</label>
          <input type="email" placeholder="Enter your first name" />
        </div>
        <div className="input-field">
          <label>Last Name:</label>
          <input type="email" placeholder="Enter your last name" />
        </div>
        <div className="input-field">
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
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

      <div className='sign_buttons_container'>
          <button  className='sign_stroke_links' onClick={() => {router.push("/Home");
      }}>Cancel</button>
    <button className='sign_stroke_links' onClick={() => {router.push("/game");
      }}>Enter</button>
  </div>
    </div>
  );
};

export default LoginScreen;

