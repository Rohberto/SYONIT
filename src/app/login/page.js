"use client"
import { useState } from 'react';
import "../signup/signup.css";
import {FaApple, FaGoogle} from "react-icons/fa"
import { FcGoogle } from 'react-icons/fc';
import Button from '../Components/syonit_button/login';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    termsAccepted: false,
    verificationCode: ['', '', '', '']
  });


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };




  
  return (
    <div className="signContainer">
      <h1 className="signHeader">SYONIT</h1>
      <h2 className="subheader">CREATE YOUR PROFILE</h2>
     
      <div className="form-container form-spacer">
        <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johnosami@email.com"
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••••••••••"
            />
            </div>
            <div className="social-login">
              <p>or sign in with:</p>
              <div className="social-buttons">
                <button className="social-button">
                  <FaApple/>
                </button>
                <button className="social-button">
                 <FcGoogle/> 
                </button>
              </div>
            </div>
          </div>
     
      <div className="button-group">
        <Button
       
        />
      </div>
    </div>
  );
}