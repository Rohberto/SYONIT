import React from 'react';
import Bottom from '../Components/loginBottom';
import Header from '../Components/Header';
import { FcGoogle } from "react-icons/fc";

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

export default LoginScreen;

